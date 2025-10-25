// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {IoTDeviceRegistry} from "../src/registries/IoTDeviceRegistry.sol";
import {Config} from "./Config.sol";
import "../src/common/Errors.sol";

contract IoTDeviceRegistryTest is Test {
    IoTDeviceRegistry public registry;

    function setUp() public {
        registry = new IoTDeviceRegistry(Config.ADMIN);
    }

    function test_RegisterDevice() public {
        vm.startPrank(Config.ADMIN);

        (uint deviceId, address deviceAddress) = registry.registerDevice("device-001", "Location A", "QmCID1");
        assertEq(deviceId, 1);
        assertNotEq(deviceAddress, address(0));
        assertEq(registry.deviceCount(), 1);
        assertEq(registry.getDevice(1), deviceAddress);
        assertTrue(registry.isDevice(deviceAddress));
    }

    function test_RevertWhen_GetInvalidDevice() public {
        vm.expectRevert(InvalidId.selector);
        registry.getDevice(999);
    }
}
