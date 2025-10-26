import { Container } from "@n8n/di";
import { bootstrap } from "@embedded-blockchain-surveillance-system/server";
import { ulid } from "ulidx";
import type { IotDevice } from "@/types";
import { IotDeviceService } from "@/features/iot/service";

await bootstrap();

const id = "ESP32_CAM";
const iotDevicePayload: IotDevice.Insertable = {
	id,
	device_code: id,
	location: "Owerri, Imo State, Nigeria",
	status: "ACTIVE",
	ip_address: null,
	last_heartbeat: null,
} as const;

const iotDeviceService = Container.get(IotDeviceService);

const createIotDevice = async (service: IotDeviceService) => {
	const iotDeviceListResult = await service.list();
	if (iotDeviceListResult.isErr) {
		console.log("❌ Failed to check existing iot devices");
		return;
	}

	if (iotDeviceListResult.value.length > 0) {
		console.log("❌ IoT device already exists");
		return;
	}

	const createIotDeviceResult = await service.create(iotDevicePayload);

	if (createIotDeviceResult.isErr) {
		console.log("❌ Failed to create IoT device");
		return;
	}

	console.log("✅ IoT device created");
};

await createIotDevice(iotDeviceService);
