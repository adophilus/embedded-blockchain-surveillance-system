// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../core/SurveillanceSession.sol";
import "../common/Errors.sol";
import "./ISurveillanceSessionRegistry.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract SurveillanceSessionRegistry is ISurveillanceSessionRegistry {
    address public admin;
    string[] public sessionIds;
    mapping(string => SurveillanceSession) public sessions;
    string public activeSessionId;

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor(address _admin) {
        admin = _admin;
    }

    function create(string memory _id, string memory _title, string memory _description, uint start_timestamp, uint end_timestamp, Status status) external onlyAdmin returns (string memory id) {
        sessions[_id] = SurveillanceSession(_id, _title, _description, start_timestamp, end_timestamp, status, block.timestamp, block.timestamp);
        sessionIds.push(_id);

        if (status == Status.ACTIVE) {
            activeSessionId = _id;
        }

        emit SessionCreated(_id);
        return _id;
    }

    function findById(string memory _id) external view returns (SurveillanceSession memory) {
        return sessions[_id];
    }

    function findActiveSession() external view returns (SurveillanceSession memory) {
        return sessions[activeSessionId];
    }

    function list() external view returns (SurveillanceSession[] memory) {
        SurveillanceSession[] memory allSessions = new SurveillanceSession[](sessionIds.length);
        for (uint i = 0; i < sessionIds.length; i++) {
            allSessions[i] = sessions[sessionIds[i]];
        }
        return allSessions;
    }

    function updateStatus(string memory _id, Status _status) external onlyAdmin {
        sessions[_id].status = _status;
        sessions[_id].updated_at = block.timestamp;
        emit SessionStatusUpdated(_id, _status);
    }
}
