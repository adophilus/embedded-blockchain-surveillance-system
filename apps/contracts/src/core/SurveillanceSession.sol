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
        if (block.timestamp < startTime || block.timestamp > endTime)
            revert NotInSession();
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

    function recordEvent(
        string memory _id,
        string[] memory _criminal_profile_ids,
        string memory _device_id,
        string memory _session_id,
        uint _created_at
    ) external onlyAssociatedDevice onlyDuringSession returns (uint) {
        eventCount++;
        events[eventCount] = SurveillanceEvent(
            _id,
            _criminal_profile_ids,
            _device_id,
            _session_id,
            _created_at
        );
        deviceEventCounts[msg.sender]++;
        emit EventRecorded(eventCount, msg.sender, _created_at);
        return eventCount;
    }

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

    function getEventCount() external view returns (uint) {
        return eventCount;
    }

    function getSessionResults()
        external
        view
        onlyAfterSession
        returns (
            address[] memory devices,
            uint[] memory eventCounts,
            bool[] memory detectionStatus
        )
    {
        // This is a placeholder implementation.
        // In a real implementation, you would iterate through associated devices and their events.
        return (new address[](0), new uint[](0), new bool[](0));
    }
}
