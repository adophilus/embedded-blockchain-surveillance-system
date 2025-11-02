// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {SurveillanceSystem} from "../src/SurveillanceSystem.sol";
import {CriminalProfileRegistry} from "../src/registries/CriminalProfileRegistry.sol";
import {IoTDeviceRegistry} from "../src/registries/IoTDeviceRegistry.sol";
import {SurveillanceSessionRegistry} from "../src/registries/SurveillanceSessionRegistry.sol";
import {SurveillanceEventRegistry} from "../src/registries/SurveillanceEventRegistry.sol";

contract DeploySurveillanceSystemScript is Script {
    SurveillanceSystem public surveillanceSystem;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        CriminalProfileRegistry criminalProfileRegistry = new CriminalProfileRegistry(msg.sender);
        IoTDeviceRegistry iotDeviceRegistry = new IoTDeviceRegistry(msg.sender);
        SurveillanceSessionRegistry surveillanceSessionRegistry = new SurveillanceSessionRegistry(msg.sender);
        SurveillanceEventRegistry surveillanceEventRegistry = new SurveillanceEventRegistry(msg.sender);

        surveillanceSystem = new SurveillanceSystem(
            address(criminalProfileRegistry),
            address(iotDeviceRegistry),
            address(surveillanceSessionRegistry),
            address(surveillanceEventRegistry)
        );

        vm.stopBroadcast();
    }
}
