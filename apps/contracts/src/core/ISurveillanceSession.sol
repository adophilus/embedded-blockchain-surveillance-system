// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ISurveillanceSessionRegistry} from "../registries/ISurveillanceSessionRegistry.sol";

interface ISurveillanceSession {
    event EventRecorded(string id);

    function get() external view returns (string memory id,string memory title, string memory description, uint start_timestamp, uint end_timestamp, ISurveillanceSessionRegistry.SessionStatus status, uint created_at, uint updated_at);
    function listEvents() external view returns (string[] memory ids, string[][] memory criminal_profile_ids, string[] memory cids, string[] memory device_codes, uint[] memory created_ats);
    function recordEvent(string memory _id, string[] memory _criminal_profile_ids, string memory _cid, string memory _device_code) external returns (string memory id);
    function updateStatus(ISurveillanceSessionRegistry.SessionStatus _status) external;
}
