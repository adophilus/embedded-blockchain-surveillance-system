// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {CriminalProfile} from "../core/CriminalProfile.sol";

interface ICriminalProfileRegistry {
    event CriminalProfileRegistered(string id, string name);

    function nextCriminalId() external view returns (uint256);

    function register(string memory _name, string[] memory _aliases, string[] memory _offenses, string memory _cid)
        external
        returns (string memory name);

    function findById(uint256 _id)
        external
        returns (
            string memory id,
            string memory name,
            string[] memory aliases,
            string[] memory offenses,
            string memory cid,
            uint256 created_at,
            uint256 updated_at
        );

    function list()
        external
        returns (
            string[] memory ids,
            string[] memory names,
            string[][] memory aliases,
            string[][] memory offenses,
            string[] memory cids,
            uint256[] memory created_ats,
            uint256[] memory updated_ats
        );
}
