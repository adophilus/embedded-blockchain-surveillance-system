// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {CriminalProfileRegistry} from "../src/registries/CriminalProfileRegistry.sol";
import {Config} from "./Config.sol";
import "../src/common/Errors.sol";

contract CriminalProfileRegistryTest is Test {
    CriminalProfileRegistry public registry;

    function setUp() public {
        registry = new CriminalProfileRegistry(Config.ADMIN);
    }

    function test_RegisterCriminalProfile() public {
        vm.startPrank(Config.ADMIN);

        string[] memory aliases = new string[](1);
        aliases[0] = "Test Alias";
        string[] memory offenses = new string[](1);
        offenses[0] = "Test Offense";

        string memory criminalId = registry.register("Test Criminal", aliases, offenses, "QmTestCID");
        assertEq(criminalId, "1");
        assertEq(registry.nextCriminalId(), 2);

        (string memory id, string memory name, string[] memory retrievedAliases, string[] memory retrievedOffenses, string memory cid, , ) = registry.findById(criminalId);
        assertEq(id, criminalId);
        assertEq(name, "Test Criminal");
        assertEq(retrievedAliases[0], "Test Alias");
        assertEq(retrievedOffenses[0], "Test Offense");
        assertEq(cid, "QmTestCID");
    }

    function test_RevertWhen_RegisterEmptyName() public {
        vm.startPrank(Config.ADMIN);
        string[] memory aliases = new string[](0);
        string[] memory offenses = new string[](0);
        vm.expectRevert(EmptyName.selector);
        registry.register("", aliases, offenses, "QmTestCID");
    }

    
}
