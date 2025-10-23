// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./ISurveillanceSystem.sol";
import "./core/SurveillanceSession.sol";
import "./core/IoTDevice.sol";
import "./core/CriminalProfile.sol";
import "./common/Errors.sol";

contract SurveillanceSystem is ISurveillanceSystem {
    address public admin;
    uint public sessionCount;
    uint public deviceCount;
    uint public criminalProfileCount;

    mapping(uint => address) public sessions;
    mapping(uint => address) public devices;
    mapping(uint => address) public criminalProfiles;

    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function createSession(string memory _cid) external onlyAdmin returns (uint sessionId, address sessionAddress) {
        sessionCount++;
        SurveillanceSession newSession = new SurveillanceSession(msg.sender, _cid);
        sessions[sessionCount] = address(newSession);
        emit SessionCreated(sessionCount, address(newSession));
        return (sessionCount, address(newSession));
    }

    function registerDevice(string memory _deviceId, string memory _location, string memory _cid) external onlyAdmin returns (uint deviceId, address deviceAddress) {
        deviceCount++;
        IoTDevice newDevice = new IoTDevice(_deviceId, _location, _cid);
        devices[deviceCount] = address(newDevice);
        emit DeviceRegistered(deviceCount, address(newDevice));
        return (deviceCount, address(newDevice));
    }

    function createCriminalProfile(string memory _name, string[] memory _aliases, string memory _cid) external onlyAdmin returns (uint criminalId, address profileAddress) {
        // This is a placeholder. In a real implementation, you would create a contract for each criminal profile.
        // For now, we'll just increment the count and emit an event.
        criminalProfileCount++;
        emit CriminalProfileCreated(criminalProfileCount, address(0));
        return (criminalProfileCount, address(0));
    }

    function getSession(uint _sessionId) external view returns (address) {
        if (_sessionId == 0 || _sessionId > sessionCount) revert InvalidId();
        return sessions[_sessionId];
    }

    function getDevice(uint _deviceId) external view returns (address) {
        if (_deviceId == 0 || _deviceId > deviceCount) revert InvalidId();
        return devices[_deviceId];
    }

    function getCriminalProfile(uint _criminalId) external view returns (address) {
        if (_criminalId == 0 || _criminalId > criminalProfileCount) revert InvalidId();
        return criminalProfiles[_criminalId];
    }
}
