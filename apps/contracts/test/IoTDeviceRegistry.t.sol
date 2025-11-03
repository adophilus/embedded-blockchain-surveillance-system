// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {IoTDeviceRegistry} from "../src/registries/IoTDeviceRegistry.sol";
import {IoTDevice, IoTDeviceStatus} from "../src/core/IoTDevice.sol";
import {Config} from "./Config.sol";
import "../src/common/Errors.sol";

contract IoTDeviceRegistryTest is Test {
    IoTDeviceRegistry public registry;

    function setUp() public {
        registry = new IoTDeviceRegistry(Config.ADMIN);
    }

    function test_RegisterDevice() public {
        vm.startPrank(Config.ADMIN);

        string memory id = "1";
        IoTDevice memory device = registry.create(
            id,
            "device-001",
            "Location A",
            IoTDeviceStatus.ACTIVE,
            "0",
            0
        );
        assertNotEq(bytes(device.id).length, 0);
        assertEq(registry.findById(id).id, device.id); // Changed
    }
}

