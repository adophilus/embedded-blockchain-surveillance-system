// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

struct SurveillanceEvent {
    string id;
    string[] criminal_profile_ids;
    string cid;
    string device_id;
    uint created_at;
}
