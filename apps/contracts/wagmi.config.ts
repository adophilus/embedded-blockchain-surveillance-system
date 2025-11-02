import { defineConfig } from "@wagmi/cli";
import type { Abi } from "viem";
import CriminalProfileRegistry from "@embedded-blockchain-surveillance-system/contracts/CriminalProfileRegistry.sol/CriminalProfileRegistry.json" with {
	type: "json",
};
import IoTDeviceRegistry from "@embedded-blockchain-surveillance-system/contracts/IoTDeviceRegistry.sol/IoTDeviceRegistry.json" with {
	type: "json",
};
import SurveillanceSessionRegistry from "@embedded-blockchain-surveillance-system/contracts/SurveillanceSessionRegistry.sol/SurveillanceSessionRegistry.json" with {
	type: "json",
};
import SurveillanceSystem from "@embedded-blockchain-surveillance-system/contracts/SurveillanceSystem.sol/SurveillanceSystem.json" with {
	type: "json",
};
import SurveillanceEventRegistry from "@embedded-blockchain-surveillance-system/contracts/SurveillanceEventRegistry.sol/SurveillanceEventRegistry.json" with {
	type: "json",
};
import IoTDevice from "@embedded-blockchain-surveillance-system/contracts/IoTDevice.sol/IoTDevice.json" with {
	type: "json",
};

export default defineConfig({
	out: "./build/types.ts",
	contracts: [
		{ name: "CriminalProfileRegistry", abi: CriminalProfileRegistry.abi as Abi },
		{ name: "IoTDeviceRegistry", abi: IoTDeviceRegistry.abi as Abi },
		{ name: "SurveillanceSessionRegistry", abi: SurveillanceSessionRegistry.abi as Abi },
		{ name: "SurveillanceSystem", abi: SurveillanceSystem.abi as Abi },
		{ name: "SurveillanceEventRegistry", abi: SurveillanceEventRegistry.abi as Abi },
		{ name: "IoTDevice", abi: IoTDevice.abi as Abi },
	],
	plugins: [],
});