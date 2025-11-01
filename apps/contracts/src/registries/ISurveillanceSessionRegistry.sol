// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ISurveillanceSessionRegistry {
    event SessionCreated(string id, address addr);
    enum SessionStatus {
        UPCOMING,
        ACTIVE,
        COMPLETED
    }

    function create(string memory _title, string memory _description, uint start_timestamp, uint end_timestamp,SessionStatus status) external returns (string memory id, address addr);
}
