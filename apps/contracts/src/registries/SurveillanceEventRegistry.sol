// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../core/SurveillanceEvent.sol";
import "../common/Errors.sol";
import "./ISurveillanceEventRegistry.sol";

contract SurveillanceEventRegistry is ISurveillanceEventRegistry {
    address public admin;
    mapping(string => SurveillanceEvent) public events;
    string[] public eventIds;

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor(address _admin) {
        admin = _admin;
    }

    function recordEvent(
        string memory _id,
        string memory _session_id,
        string[] memory _criminal_profile_ids,
        string memory _cid,
        string memory _device_code
    ) external onlyAdmin returns (string memory id) {
        SurveillanceEvent memory newEvent = SurveillanceEvent({
            id: _id,
            criminal_profile_ids: _criminal_profile_ids,
            cid: _cid,
            device_code: _device_code,
            session_id: _session_id,
            created_at: block.timestamp
        });

        events[_id] = newEvent;
        eventIds.push(_id);

        emit EventRecorded(_id);
        return _id;
    }

    function findById(
        string memory _id
    ) external view returns (SurveillanceEvent memory) {
        return events[_id];
    }

    function list() external view returns (SurveillanceEvent[] memory) {
        SurveillanceEvent[] memory sessionEventsList = new SurveillanceEvent[](
            eventIds.length
        );

        for (uint i = 0; i < eventIds.length; i++) {
            sessionEventsList[i] = events[eventIds[i]];
        }

        return sessionEventsList;
    }
}

