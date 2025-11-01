// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./IIoTDevice.sol";
import "../common/Errors.sol";

contract IoTDevice is IIoTDevice {
    string public id;
    string public device_code;
    string public location;
    string public cid;
    address public admin;
    uint public eventCount;
    mapping(uint => SurveillanceEvent) private events;
    bool public active;

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor(string memory _id, string memory _device_code, string memory _location, string memory _cid, address _admin) {
        id = _id;
        device_code = _device_code;
        location = _location;
        cid = _cid;
        admin = _admin;
        active = true;
    }

    function recordEvent(SurveillanceEvent memory _event) external onlyAdmin returns (uint) {
        eventCount++;
        events[eventCount] = _event;
        emit EventRecorded(eventCount, _event.timestamp, true);
        return eventCount;
    }

    function getEvent(uint _eventId) external view returns (SurveillanceEvent memory) {
        if (_eventId == 0 || _eventId > eventCount) revert InvalidId();
        return events[_eventId];
    }

    function getAllEvents() external view returns (SurveillanceEvent[] memory) {
        SurveillanceEvent[] memory allEvents = new SurveillanceEvent[](eventCount);
        for (uint i = 0; i < eventCount; i++) {
            allEvents[i] = events[i + 1];
        }
        return allEvents;
    }

    function events(uint _eventId) external view returns (SurveillanceEvent memory) {
        if (_eventId == 0 || _eventId > eventCount) revert InvalidId();
        return events[_eventId];
    }
}
