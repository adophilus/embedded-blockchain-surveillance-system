// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../core/SurveillanceSession.sol";
import "../common/Errors.sol";
import "./ISurveillanceSessionRegistry.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract SurveillanceSessionRegistry is ISurveillanceSessionRegistry {
    address public admin;
    string[] public sessionIds;
    mapping(string => address) public sessions;
    string public activeSessionId;
    uint nextSessionId;

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor(address _admin) {
        admin = _admin;
    }

    function create(string memory _title, string memory _description, uint start_timestamp, uint end_timestamp, SessionStatus status) external onlyAdmin returns (string memory id, address addr) {
        nextSessionId++;
        id = Strings.toString(nextSessionId);
        SurveillanceSession newSession = new SurveillanceSession(admin, id, _title, _description, start_timestamp, end_timestamp, status);
        addr = address(newSession);
        sessions[id] = addr;
        sessionIds.push(id);

        if (status == SessionStatus.ACTIVE) {
            activeSessionId = id;
        }

        emit SessionCreated(id, addr);
        return (id, addr);
    }

    function findById(string memory _id) external view returns (address) {
        return sessions[_id];
    }

    function findActiveSession() external view returns (address) {
        return sessions[activeSessionId];
    }

    function list() external view returns (address[] memory) {
        address[] memory sessionAddresses = new address[](sessionIds.length);
        for (uint i = 0; i < sessionIds.length; i++) {
            sessionAddresses[i] = sessions[sessionIds[i]];
        }
        return sessionAddresses;
    }
}
