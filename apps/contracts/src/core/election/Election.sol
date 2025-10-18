// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {VoterRegistry} from "../voter/registry/VoterRegistry.sol";
import {Party} from "../party/Party.sol";
import {console} from "forge-std/console.sol";
import "../../common/Errors.sol";
import {IElection} from "./IElection.sol";

contract Election is IElection {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    uint public startTime;
    uint public endTime;
    bool public electionStarted;
    bool public electionEnded;
    string public name;
    string public description;
    string public cid; // IPFS CID for election-related media
    address public voterRegistryAddress;
    address public admin;

    // Mapping of parties participating in this election
    mapping(address => bool) public participatingParties;
    address[] public participatingPartyAddresses;
    mapping(address => mapping(uint => uint)) public partyCandidateVoteCounts; // party => candidateId => voteCount

    // Track voters registered for this specific election (must be in VoterRegistry first)
    mapping(address => bool) public registeredVoters;

    // Track voters who have voted in this election
    mapping(address => bool) public hasVoted;

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    modifier onlyDuringElection() {
        if (block.timestamp < startTime || block.timestamp > endTime)
            revert NotWithinElectionPeriod();
        _;
    }

    modifier hasNotVoted() {
        if (hasVoted[msg.sender]) revert AlreadyVoted();
        _;
    }

    modifier onlyAfterElection() {
        if (block.timestamp <= endTime) revert ElectionNotEnded();
        _;
    }

    modifier onlyRegisteredVoter() {
        if (!registeredVoters[msg.sender])
            revert VoterNotRegisteredForElection();
        _;
    }

    constructor(
        string memory _name,
        string memory _description,
        string memory _cid,
        address _voterRegistryAddress,
        address _admin
    ) {
        name = _name;
        description = _description;
        cid = _cid;
        voterRegistryAddress = _voterRegistryAddress;
        admin = _admin;
    }

    function startElection(uint _startTime, uint _endTime) external onlyAdmin {
        if (electionStarted) revert ElectionAlreadyStarted();
        if (_startTime < block.timestamp) revert StartTimeNotInFuture();
        if (_endTime <= _startTime) revert EndTimeBeforeStartTime();

        startTime = _startTime;
        endTime = _endTime;
        electionStarted = true;

        emit ElectionStarted(_startTime, _endTime);
    }

    function endElection() external onlyAdmin onlyAfterElection {
        electionEnded = true;
        emit ElectionEnded();
    }

    function addParty(address _party) external onlyAdmin {
        if (!electionStarted) revert ElectionNotStarted();
        if (electionEnded) revert ErrorElectionEnded();
        if (_party == address(0)) revert InvalidPartyAddress();

        participatingParties[_party] = true;
        participatingPartyAddresses.push(_party);
        emit PartyAdded(_party);
    }

    function registerVoterForElection(address _voter) external onlyAdmin {
        VoterRegistry voterRegistry = VoterRegistry(voterRegistryAddress);
        if (!voterRegistry.isVoterRegistered(_voter))
            revert VoterNotInRegistry();
        if (registeredVoters[_voter])
            revert VoterAlreadyRegisteredForElection();
        if (electionStarted) revert ElectionAlreadyStarted();
        registeredVoters[_voter] = true;
        emit VoterRegistered(_voter);
        console.log("Voter registered for election");
    }

    function vote(
        address _party,
        uint _candidateId
    ) external onlyRegisteredVoter hasNotVoted onlyDuringElection {
        if (!participatingParties[_party]) revert PartyNotParticipating();
        console.log("Party registered");

        // Verify that the candidate exists in the party
        Party party = Party(_party);
        console.log("Got party");
        (uint id, , , ) = party.getCandidate(_candidateId);
        console.log("Got candidate id");
        if (id != _candidateId) revert InvalidCandidate();

        hasVoted[msg.sender] = true;
        console.log("tracked vote");
        partyCandidateVoteCounts[_party][_candidateId]++;
        console.log("increased candidate count");

        emit VoteCast(msg.sender, _party, _candidateId);
        console.log("emitted event");
    }

    function getVoteCount(
        address _party,
        uint _candidateId
    ) external view returns (uint) {
        return partyCandidateVoteCounts[_party][_candidateId];
    }

    function getElectionResults()
        external
        view
        onlyAfterElection
        returns (
            address[] memory _parties,
            uint[][] memory _candidateIds,
            uint[][] memory _voteCounts
        )
    {
        uint numParties = participatingPartyAddresses.length;
        _parties = new address[](numParties);
        _candidateIds = new uint[][](numParties);
        _voteCounts = new uint[][](numParties);

        for (uint i = 0; i < numParties; i++) {
            address partyAddress = participatingPartyAddresses[i];
            Party party = Party(partyAddress);

            (uint[] memory ids, , , ) = party.getAllCandidates();
            uint numCandidates = ids.length;

            uint[] memory currentCandidateIds = new uint[](numCandidates);
            uint[] memory currentVoteCounts = new uint[](numCandidates);

            for (uint j = 0; j < numCandidates; j++) {
                uint candidateId = ids[j];
                currentCandidateIds[j] = candidateId;
                currentVoteCounts[j] = partyCandidateVoteCounts[partyAddress][
                    candidateId
                ];
            }
            _parties[i] = partyAddress;
            _candidateIds[i] = currentCandidateIds;
            _voteCounts[i] = currentVoteCounts;
        }
    }
}
