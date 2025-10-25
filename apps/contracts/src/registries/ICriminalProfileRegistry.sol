// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {CriminalProfile} from "../core/CriminalProfile.sol";

interface ICriminalProfileRegistry {
    event CriminalProfileRegistered(uint indexed criminalId, string name);
    event CriminalProfileUpdated(uint indexed criminalId, string name);

    function nextCriminalId() external view returns (uint);

    function registerCriminalProfile(
        string memory _name,
        string[] memory _aliases,
        string memory _cid
    ) external returns (uint);

    function updateCriminalProfile(
        uint _criminalId,
        string memory _name,
        string[] memory _aliases,
        string memory _cid
    ) external;
}
