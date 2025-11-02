// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./registries/ISurveillanceSessionRegistry.sol";

struct SurveillanceSession {
    string id;
    address admin;
    string title;
    string description;
    uint start_timestamp;
    uint end_timestamp;
    ISurveillanceSessionRegistry.SessionStatus status;
    uint created_at;
    uint updated_at;
}