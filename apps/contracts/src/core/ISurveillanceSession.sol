// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ISurveillanceSessionRegistry} from "../registries/ISurveillanceSessionRegistry.sol";

interface ISurveillanceSession {
    event DeviceAdded(address indexed device);
    event EventRecorded(uint indexed eventId, address indexed device, uint timestamp);

    function admin() external view returns (address);
    function title() external view returns (string memory);
    function description() external view returns (string memory);
    function start_timestamp() external view returns (uint);
    function end_timestamp() external view returns (uint);
    function status() external view returns (ISurveillanceSessionRegistry.SessionStatus);

    function addDevice(address _device) external;
    function recordEvent(uint _deviceId, uint _timestamp, bool _detected) external returns (uint);
}