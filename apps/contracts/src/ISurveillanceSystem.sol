// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ISurveillanceSystem {
    event SessionCreated(uint indexed sessionId, address sessionAddress);
    event DeviceRegistered(uint indexed deviceId, address deviceAddress);
    event CriminalProfileCreated(uint indexed criminalId, address profileAddress);

    function admin() external view returns (address);
    function sessionCount() external view returns (uint);
    function deviceCount() external view returns (uint);
    function criminalProfileCount() external view returns (uint);

    function createSession(string memory _cid) external returns (uint sessionId, address sessionAddress);
    function registerDevice(string memory _deviceId, string memory _location, string memory _cid) external returns (uint deviceId, address deviceAddress);
    function createCriminalProfile(string memory _name, string[] memory _aliases, string memory _cid) external returns (uint criminalId, address profileAddress);

    function getSession(uint _sessionId) external view returns (address);
    function getDevice(uint _deviceId) external view returns (address);
    function getCriminalProfile(uint _criminalId) external view returns (address);
}
