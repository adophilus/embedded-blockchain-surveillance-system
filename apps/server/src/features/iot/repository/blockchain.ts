import { Result, type Unit } from "true-myth";
import type {
	IotDeviceRepository,
	UpdateHeartbeatError,
	FindByIdError,
	ListError,
	CreateError,
} from "./interface";
import type { Logger } from "@/features/logger";
import type { IotDevice } from "@/types";
import { BlockchainSurveillanceSystem } from "@embedded-blockchain-surveillance-system/core/surveillance-system/implementation";

export class BlockchainIotDeviceRepository implements IotDeviceRepository {
	constructor(
		private readonly blockchainSurveillanceSystem: BlockchainSurveillanceSystem,
		private readonly logger: Logger,
	) {}

	public async create(
		payload: IotDevice.Insertable,
	): Promise<Result<Unit, CreateError>> {
		try {
			const result = await this.blockchainSurveillanceSystem.createIoTDevice(
				payload.id,
				payload.device_code,
				payload.location,
				payload.status,
				payload.ip_address,
				BigInt(payload.last_heartbeat.getTime() / 1000), // Convert Date to Unix timestamp
			);

			if (result.isErr) {
				this.logger.error("Failed to create IoT device on blockchain", result.error);
				return Result.err("ERR_UNEXPECTED");
			}

			return Result.ok();
		} catch (error) {
			this.logger.error("Failed to create IoT device", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}

	public async list(): Promise<Result<IotDevice.Selectable[], ListError>> {
		try {
			const result = await this.blockchainSurveillanceSystem.listIoTDevices();

			if (result.isErr) {
				this.logger.error("Failed to list IoT devices from blockchain", result.error);
				return Result.err("ERR_UNEXPECTED");
			}

			const devices: IotDevice.Selectable[] = result.value.map((device) => ({
				id: device.id,
				device_code: device.device_code,
				location: device.location,
				status: device.status,
				ip_address: device.ip_address,
				last_heartbeat: new Date(Number(device.last_heartbeat) * 1000), // Convert Unix timestamp to Date
				created_at: new Date(Number(device.created_at) * 1000),
				updated_at: new Date(Number(device.updated_at) * 1000),
			}));

			return Result.ok(devices);
		} catch (error) {
			this.logger.error("Failed to list IoT devices", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}

	public async updateHeartbeat(
		deviceId: string,
		timestamp: Date,
	): Promise<Result<Unit, UpdateHeartbeatError>> {
		try {
			const result = await this.blockchainSurveillanceSystem.updateIoTDeviceHeartbeat(
				deviceId,
				BigInt(timestamp.getTime() / 1000), // Convert Date to Unix timestamp
			);

			if (result.isErr) {
				this.logger.error("Failed to update device heartbeat on blockchain", result.error);
				if (result.error.type === "IoTDeviceNotFoundError") {
					return Result.err("ERR_DEVICE_NOT_FOUND");
				}
				return Result.err("ERR_UNEXPECTED");
			}

			return Result.ok();
		} catch (error) {
			this.logger.error("Failed to update device heartbeat", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}

	public async findById(
		deviceId: string,
	): Promise<Result<IotDevice.Selectable | null, FindByIdError>> {
		try {
			const result = await this.blockchainSurveillanceSystem.getIoTDevice(deviceId);

			if (result.isErr) {
				this.logger.error("Failed to find IoT device by id on blockchain", result.error);
				if (result.error.type === "IoTDeviceNotFoundError") {
					return Result.ok(null);
				}
				return Result.err("ERR_UNEXPECTED");
			}

			const device = result.value;
			return Result.ok({
				id: device.id,
				device_code: device.device_code,
				location: device.location,
				status: device.status,
				ip_address: device.ip_address,
				last_heartbeat: new Date(Number(device.last_heartbeat) * 1000), // Convert Unix timestamp to Date
				created_at: new Date(Number(device.created_at) * 1000),
				updated_at: new Date(Number(device.updated_at) * 1000),
			});
		} catch (error) {
			this.logger.error("Failed to find device by id", error);
			return Result.err("ERR_UNEXPECTED");
		}
	}
}