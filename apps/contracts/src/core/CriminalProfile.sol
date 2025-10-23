// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

struct CriminalProfile {
    uint id;
    string name;
    string[] aliases;
    string cid; // IPFS CID for mugshot and additional information
}
