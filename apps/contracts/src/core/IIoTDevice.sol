// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {SurveillanceEvent} from "./SurveillanceEvent.sol";

interface IIoTDevice {
    enum Status {
        ACTIVE,
        INACTIVE,
        MAINTENANCE
    }
    
    function get() external view returns (string memory id, string memory device_code, string memory location, Status status, string memory ip_address, uint last_heartbeat);
    function updateHeartbeat(uint _new_heartbeat) external;
}
