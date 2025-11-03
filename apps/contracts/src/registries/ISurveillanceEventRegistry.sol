// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {SurveillanceEvent} from "../core/SurveillanceEvent.sol";

interface ISurveillanceEventRegistry {
    event EventRecorded(string id);

    function recordEvent(string memory _id, string memory _session_id, string[] memory _criminal_profile_ids, string memory _cid, string memory _device_code) external returns (string memory id);
    function findById(string memory _id) external view returns (SurveillanceEvent memory);
    function list() external view returns (SurveillanceEvent[] memory);
}
