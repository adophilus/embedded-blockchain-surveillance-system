// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

struct Detection {
    string criminalProfileId;
}

struct SurveillanceEvent {
    string id;
    string sessionId;
    string deviceId;
    uint timestamp;
    Detection[] detections;
    string cid;
    uint createdAt;
}