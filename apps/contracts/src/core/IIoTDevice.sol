// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {SurveillanceEvent} from "./SurveillanceEvent.sol";

interface IIoTDevice {
    event EventRecorded(uint indexed eventId, uint timestamp, bool detected);

    function id() external view returns (string memory);
    function device_code() external view returns (string memory);
    function location() external view returns (string memory);
    function cid() external view returns (string memory);
    function admin() external view returns (address);
    function eventCount() external view returns (uint);
    function events(uint) external view returns (SurveillanceEvent memory);
    function active() external view returns (bool);

    function recordEvent(SurveillanceEvent memory _event) external returns (uint);
    function getEvent(uint _eventId) external view returns (SurveillanceEvent memory);
    function getAllEvents() external view returns (SurveillanceEvent[] memory);
}
