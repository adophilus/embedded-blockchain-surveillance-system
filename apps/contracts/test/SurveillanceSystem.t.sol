// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {SurveillanceSystem} from "../src/SurveillanceSystem.sol";
import {CriminalProfileRegistry} from "../src/registries/CriminalProfileRegistry.sol";
import {IoTDeviceRegistry} from "../src/registries/IoTDeviceRegistry.sol";
import {SurveillanceSessionRegistry} from "../src/registries/SurveillanceSessionRegistry.sol";
import {SurveillanceEventRegistry} from "../src/registries/SurveillanceEventRegistry.sol";
import {Config} from "./Config.sol";

contract SurveillanceSystemTest is Test {
    SurveillanceSystem public surveillanceSystem;
    CriminalProfileRegistry public criminalProfileRegistry;
    IoTDeviceRegistry public iotDeviceRegistry;
    SurveillanceSessionRegistry public surveillanceSessionRegistry;
    SurveillanceEventRegistry public surveillanceEventRegistry;

    function setUp() public {
        criminalProfileRegistry = new CriminalProfileRegistry(Config.ADMIN);
        iotDeviceRegistry = new IoTDeviceRegistry(Config.ADMIN);
        surveillanceSessionRegistry = new SurveillanceSessionRegistry(Config.ADMIN);
        surveillanceEventRegistry = new SurveillanceEventRegistry(Config.ADMIN);

        surveillanceSystem = new SurveillanceSystem(
            address(criminalProfileRegistry),
            address(iotDeviceRegistry),
            address(surveillanceSessionRegistry),
            address(surveillanceEventRegistry)
        );
    }

    function test_SystemCreation() public view {
        assertEq(
            surveillanceSystem.criminalProfileRegistry(),
            address(criminalProfileRegistry)
        );
        assertEq(
            surveillanceSystem.iotDeviceRegistry(),
            address(iotDeviceRegistry)
        );
        assertEq(
            surveillanceSystem.surveillanceSessionRegistry(),
            address(surveillanceSessionRegistry)
        );
        assertEq(
            surveillanceSystem.surveillanceEventRegistry(),
            address(surveillanceEventRegistry)
        );
    }
}
