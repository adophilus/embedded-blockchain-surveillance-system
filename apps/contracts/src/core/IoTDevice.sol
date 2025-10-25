// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./IIoTDevice.sol";
import "../common/Errors.sol";
import {SurveillanceEvent, Detection} from "./SurveillanceEvent.sol";

contract IoTDevice is IIoTDevice {
    string public deviceId;
    string public location;
    string public cid;
    address public admin;
    uint public eventCount;
    mapping(uint => SurveillanceEvent) public events;
    bool public active;

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor(
        string memory _deviceId,
        string memory _location,
        string memory _cid
    ) {
        deviceId = _deviceId;
        location = _location;
        cid = _cid;
        admin = msg.sender;
        active = true;
    }

    /**
     * Record a new event with the full SurveillanceEvent payload.
     */
    function recordEvent(
        string memory _id,
        string[] memory _criminal_profile_ids,
        string memory _device_id,
        string memory _session_id,
        uint _created_at
    ) external onlyAdmin returns (uint) {
        eventCount++;
        events[eventCount] = SurveillanceEvent(
            _id,
            _criminal_profile_ids,
            _device_id,
            _session_id,
            _created_at
        );

        emit EventRecorded(eventCount, _created_at);
        return eventCount;
    }

    /**
     * Return the full SurveillanceEvent tuple for a given event id.
     */
    function getEvent(
        uint _eventId
    )
        external
        view
        returns (
            string memory id,
            string[] memory criminal_profile_ids,
            string memory device_id,
            string memory session_id,
            uint created_at
        )
    {
        if (_eventId == 0 || _eventId > eventCount) revert InvalidId();
        SurveillanceEvent memory e = events[_eventId];
        return (
            e.id,
            e.criminal_profile_ids,
            e.device_id,
            e.session_id,
            e.created_at
        );
    }

    /**
     * Return arrays of fields for all recorded events.
     */
    function getAllEvents()
        external
        view
        returns (
            string[] memory ids,
            string[][] memory criminal_profile_ids,
            string[] memory device_ids,
            string[] memory session_ids,
            uint[] memory created_ats
        )
    {
        ids = new string[](eventCount);
        criminal_profile_ids = new string[][](eventCount);
        device_ids = new string[](eventCount);
        session_ids = new string[](eventCount);
        created_ats = new uint[](eventCount);

        for (uint i = 0; i < eventCount; i++) {
            SurveillanceEvent memory e = events[i + 1];
            ids[i] = e.id;
            criminal_profile_ids[i] = e.criminal_profile_ids;
            device_ids[i] = e.device_id;
            session_ids[i] = e.session_id;
            created_ats[i] = e.created_at;
        }
    }
}
