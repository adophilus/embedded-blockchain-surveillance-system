// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../core/CriminalProfile.sol";
import "../common/Errors.sol";
import "./ICriminalProfileRegistry.sol";

contract CriminalProfileRegistry is ICriminalProfileRegistry {
    address public admin;
    uint public nextCriminalId;
            mapping(uint => CriminalProfile) public criminalProfiles;

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor(address _admin) {
        admin = _admin;
        nextCriminalId = 1;
    }

    function registerCriminalProfile(
        string memory _name,
        string[] memory _aliases,
        string[] memory _offenses,
        string memory _cid
    ) external onlyAdmin returns (uint) {
        if (bytes(_name).length == 0) revert EmptyName();

        uint currentId = nextCriminalId;
        criminalProfiles[currentId] = CriminalProfile(currentId, _name, _aliases, _offenses, _cid);
        nextCriminalId++;
        emit CriminalProfileRegistered(currentId, _name);
        return currentId;
    }

    function updateCriminalProfile(
        uint _criminalId,
        string memory _name,
        string[] memory _aliases,
        string[] memory _offenses,
        string memory _cid
    ) external onlyAdmin {
        if (_criminalId == 0 || _criminalId >= nextCriminalId) revert InvalidId();
        if (bytes(_name).length == 0) revert EmptyName();

        criminalProfiles[_criminalId].name = _name;
        criminalProfiles[_criminalId].aliases = _aliases;
        criminalProfiles[_criminalId].offenses = _offenses;
        criminalProfiles[_criminalId].cid = _cid;
        emit CriminalProfileUpdated(_criminalId, _name);
    }

    function getCriminalProfile(
        uint _criminalId
    ) external view returns (uint id, string memory name, string[] memory aliases, string[] memory offenses, string memory cid) {
        if (_criminalId == 0 || _criminalId >= nextCriminalId) revert InvalidId();
        CriminalProfile memory c = criminalProfiles[_criminalId];
        return (c.id, c.name, c.aliases, c.offenses, c.cid);
    }
}
