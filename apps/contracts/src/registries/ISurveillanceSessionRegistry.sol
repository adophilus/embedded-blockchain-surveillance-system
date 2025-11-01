// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ISurveillanceSessionRegistry {
    event SessionCreated(string id, address addr);
    event SessionStatusUpdated(string id, SessionStatus status);

    enum SessionStatus {
        UPCOMING,
        ACTIVE,
        COMPLETED
    }

    function create(string memory _id, string memory _title, string memory _description, uint start_timestamp, uint end_timestamp,SessionStatus status) external returns (address addr);
    function findById(string memory _id) external view returns (address);
    function findActiveSession() external view returns (address);
    function list() external view returns (address[] memory);
}