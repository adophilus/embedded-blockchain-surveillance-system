// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

enum Status {
    UPCOMING,
    ACTIVE,
    COMPLETED
}

struct SurveillanceSession {
    string id;
    string title;
    string description;
    uint start_timestamp;
    uint end_timestamp;
    Status status;
    uint created_at;
    uint updated_at;
}

