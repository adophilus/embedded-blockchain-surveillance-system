// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {SurveillanceEvent} from "./SurveillanceEvent.sol";

interface ISurveillanceSession {
    event SessionStarted(uint startTime, uint endTime);
    event DeviceAdded(address indexed device);
    event EventRecorded(uint indexed eventId, address indexed device, uint timestamp);
    event SessionEnded();

    function admin() external view returns (address);
    function startTime() external view returns (uint);
    function endTime() external view returns (uint);
    function sessionStarted() external view returns (bool);
    function sessionEnded() external view returns (bool);
    function cid() external view returns (string memory);
    function associatedDevices(address) external view returns (bool);
    function deviceEventCounts(address) external view returns (uint);
    function events(uint) external view returns (uint timestamp, bool detected);

    function startSession(uint _startTime, uint _endTime) external;
    function endSession() external;
    function addDevice(address _device) external;
    function recordEvent(uint _timestamp, bool _detected) external returns (uint);
    function getEventCount() external view returns (uint);
    function getSessionResults() external view returns (address[] memory devices, uint[] memory eventCounts, bool[] memory detectionStatus);
}
