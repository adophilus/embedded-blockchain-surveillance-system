// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ISurveillanceSystem {
    function admin() external view returns (address);
    function criminalProfileRegistry() external view returns (address);
    function iotDeviceRegistry() external view returns (address);
    function surveillanceSessionRegistry() external view returns (address);
}
