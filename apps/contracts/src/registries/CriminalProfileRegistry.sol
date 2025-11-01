// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../core/CriminalProfile.sol";
import "../common/Errors.sol";
import "./ICriminalProfileRegistry.sol";

contract CriminalProfileRegistry is ICriminalProfileRegistry {
    address public admin;
    uint256 public nextCriminalId;
    mapping(string => CriminalProfile) public idToCriminalProfile;

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor(address _admin) {
        admin = _admin;
        nextCriminalId = 1;
    }

    function register(string memory _name, string[] memory _aliases, string[] memory _offenses, string memory _cid)
        external
        onlyAdmin
        returns (string memory)
    {
        if (bytes(_name).length == 0) revert EmptyName();

        string currentId = string(nextCriminalId);
        uint256 _created_at = block.timestamp;
        uint256 _updated_at = block.timestamp;
        idToCriminalProfile[currentId] =
            CriminalProfile(currentId, _name, _aliases, _offenses, _cid, _created_at, _updated_at);
        nextCriminalId++;
        emit CriminalProfileRegistered(currentId, _name);
        return currentId;
    }

    function findById(string memory _id)
        external
        view
        returns (
            uint256 id,
            string memory name,
            string[] memory aliases,
            string[] memory offenses,
            string memory cid,
            uint256 created_at,
            uint256 updated_at
        )
    {
        CriminalProfile memory c = idToCriminalProfile[_id];
        return (c.id, c.name, c.aliases, c.offenses, c.cid, c.created_at, c.updated_at);
    }
}
