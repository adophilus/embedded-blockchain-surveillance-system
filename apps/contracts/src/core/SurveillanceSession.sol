// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./ISurveillanceSession.sol";
import "../common/Errors.sol";

contract SurveillanceSession is ISurveillanceSession {
    address public admin;
    uint public startTime;
    uint public endTime;
    bool public sessionStarted;
    bool public sessionEnded;
    string public cid;
    mapping(address => bool) public associatedDevices;
    mapping(address => uint) public deviceEventCounts;
    mapping(uint => SurveillanceEvent) public events;
    uint private eventCount;

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    modifier onlyDuringSession() {
        if (block.timestamp < startTime || block.timestamp > endTime) revert NotInSession();
        _;
    }

    modifier onlyAssociatedDevice() {
        if (!associatedDevices[msg.sender]) revert NotRegistered();
        _;
    }

    modifier onlyAfterSession() {
        if (block.timestamp <= endTime) revert SessionNotEnded();
        _;
    }

    constructor(address _admin, string memory _cid) {
        admin = _admin;
        cid = _cid;
    }

    function startSession(uint _startTime, uint _endTime) external onlyAdmin {
        if (sessionStarted) revert SessionAlreadyStarted();
        if (_startTime < block.timestamp) revert StartTimeNotInFuture();
        if (_endTime <= _startTime) revert EndTimeBeforeStartTime();

        startTime = _startTime;
        endTime = _endTime;
        sessionStarted = true;

        emit SessionStarted(_startTime, _endTime);
    }

    function endSession() external onlyAdmin onlyAfterSession {
        sessionEnded = true;
        emit SessionEnded();
    }

    function addDevice(address _device) external onlyAdmin {
        if (!sessionStarted) revert SessionNotStarted();
                if (sessionEnded) revert SessionAlreadyEnded();
        if (_device == address(0)) revert InvalidAddress();

        associatedDevices[_device] = true;
        emit DeviceAdded(_device);
    }

    function recordEvent(uint _timestamp, bool _detected) external onlyAssociatedDevice onlyDuringSession returns (uint) {
        eventCount++;
        events[eventCount] = SurveillanceEvent(_timestamp, _detected);
        deviceEventCounts[msg.sender]++;
        emit EventRecorded(eventCount, msg.sender, _timestamp);
        return eventCount;
    }

    function getEventCount(uint _eventId) external view returns (uint) {
        if (_eventId == 0 || _eventId > eventCount) revert InvalidId();
        return 1; // Placeholder
    }

    function getSessionResults() external view onlyAfterSession returns (address[] memory devices, uint[] memory eventCounts, bool[] memory detectionStatus) {
        // This is a placeholder implementation.
        // In a real implementation, you would iterate through associated devices and their events.
        return (new address[](0), new uint[](0), new bool[](0));
    }
}
