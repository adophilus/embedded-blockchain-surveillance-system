// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

struct CriminalProfile {
    string id;
    string name;
    string[] aliases;
    string[] offenses;
    string cid;
    uint256 created_at;
    uint256 updated_at;
}
