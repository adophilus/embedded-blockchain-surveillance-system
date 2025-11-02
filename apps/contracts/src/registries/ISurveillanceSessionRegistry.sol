// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {SurveillanceSession} from "../core/SurveillanceSession.sol";

interface ISurveillanceSessionRegistry {
    event SessionCreated(string id);
    event SessionStatusUpdated(string id, SessionStatus status);

    enum SessionStatus {
        UPCOMING,
        ACTIVE,
        COMPLETED
    }

    function create(string memory _id, string memory _title, string memory _description, uint start_timestamp, uint end_timestamp, SessionStatus status) external returns (string memory id);
    function findById(string memory _id) external view returns (SurveillanceSession memory);
    function findActiveSession() external view returns (SurveillanceSession memory);
    function list() external view returns (SurveillanceSession[] memory);
    function updateStatus(string memory _id, SessionStatus _status) external;
}