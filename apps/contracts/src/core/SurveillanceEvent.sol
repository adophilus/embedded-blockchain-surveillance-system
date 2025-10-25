// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

struct Detection {
    string criminal_profile_id;
}

struct SurveillanceEvent {
    string id;
    Detection[] detections;
    string device_id;
    string session_id;
    uint created_at;
}
