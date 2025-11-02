// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../core/SurveillanceEvent.sol";
import "../common/Errors.sol";
import "./ISurveillanceEventRegistry.sol";

contract SurveillanceEventRegistry is ISurveillanceEventRegistry {
    address public admin;
    mapping(string => SurveillanceEvent) public events;
    mapping(string => string[]) public sessionEvents;

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor(address _admin) {
        admin = _admin;
    }

    function recordEvent(string memory _id, string memory _sessionId, string[] memory _criminal_profile_ids, string memory _cid, string memory _device_code) external onlyAdmin returns (string memory id) {
        SurveillanceEvent memory newEvent = SurveillanceEvent({
            id: _id,
            criminal_profile_ids: _criminal_profile_ids,
            cid: _cid,
            device_code: _device_code,
            created_at: block.timestamp
        });

        events[_id] = newEvent;
        sessionEvents[_sessionId].push(_id);

        emit EventRecorded(_id);
        return _id;
    }

    function findById(string memory _id) external view returns (SurveillanceEvent memory) {
        return events[_id];
    }

    function listBySessionId(string memory _sessionId) external view returns (SurveillanceEvent[] memory) {
        string[] memory eventIds = sessionEvents[_sessionId];
        SurveillanceEvent[] memory sessionEventsList = new SurveillanceEvent[](eventIds.length);

        for (uint i = 0; i < eventIds.length; i++) {
            sessionEventsList[i] = events[eventIds[i]];
        }

        return sessionEventsList;
    }
}