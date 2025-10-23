// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./IIoTDevice.sol";
import "../common/Errors.sol";

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

    constructor(string memory _deviceId, string memory _location, string memory _cid) {
        deviceId = _deviceId;
        location = _location;
        cid = _cid;
        admin = msg.sender;
        active = true;
    }

    function recordEvent(uint _timestamp, bool _detected) external onlyAdmin returns (uint) {
        eventCount++;
        events[eventCount] = SurveillanceEvent(_timestamp, _detected);
        emit EventRecorded(eventCount, _timestamp, _detected);
        return eventCount;
    }

    function getEvent(uint _eventId) external view returns (uint timestamp, bool detected) {
        if (_eventId == 0 || _eventId > eventCount) revert InvalidId();
        SurveillanceEvent memory e = events[_eventId];
        return (e.timestamp, e.detected);
    }

    function getAllEvents() external view returns (uint[] memory timestamps, bool[] memory detections) {
        timestamps = new uint[](eventCount);
        detections = new bool[](eventCount);
        for (uint i = 0; i < eventCount; i++) {
            SurveillanceEvent memory e = events[i + 1];
            timestamps[i] = e.timestamp;
            detections[i] = e.detected;
        }
    }
}
