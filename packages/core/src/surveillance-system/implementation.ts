import {
	type Address,
	parseEventLogs,
} from "viem";
import { Result } from "true-myth";
import type { Wallet } from "../wallet";
import type {
	SurveillanceSystem,
	RegisterCriminalProfileError,
	UpdateCriminalProfileError,
	GetCriminalProfileError,
	RegisterIoTDeviceError,
	GetIoTDeviceError,
	CreateSurveillanceSessionError,
	GetSurveillanceSessionError,
	CriminalProfileDetails,
	IoTDeviceDetails,
	SurveillanceSessionDetails,
} from "./interface";

import {
	criminalProfileRegistryAbi,
	ioTDeviceRegistryAbi,
	surveillanceSessionRegistryAbi,
	surveillanceSystemAbi,
} from "@embedded-blockchain-surveillance-system/contracts/types";

class BlockchainSurveillanceSystem implements SurveillanceSystem {
	constructor(
		private readonly wallet: Wallet,
		private readonly surveillanceSystemAddress: Address,
	) {}

	private getAccountAddress(): Address {
		return this.wallet.getWalletClient().account!.address;
	}

	// Criminal Profile Management
	public async registerCriminalProfile(
		name: string,
		aliases: string[],
		offenses: string[],
		cid: string,
	): Promise<Result<number, RegisterCriminalProfileError>> {
		try {
			const walletClient = this.wallet.getWalletClient();
			const publicClient = this.wallet.getPublicClient();
			const account = this.getAccountAddress();

			const criminalProfileRegistryAddress = await publicClient.readContract({
				address: this.surveillanceSystemAddress,
				abi: surveillanceSystemAbi,
				functionName: "criminalProfileRegistry",
			});

			const { request } = await publicClient.simulateContract({
				address: criminalProfileRegistryAddress,
				abi: criminalProfileRegistryAbi,
				functionName: "registerCriminalProfile",
				args: [name, aliases, offenses, cid],
				account,
			});

			const hash = await walletClient.writeContract(request);
			const receipt = await publicClient.waitForTransactionReceipt({ hash });

			const logs = parseEventLogs({
				abi: criminalProfileRegistryAbi,
				logs: receipt.logs,
				eventName: "CriminalProfileRegistered",
			});

			const event = logs.find(
				(log) => log.eventName === "CriminalProfileRegistered",
			);

			if (!event || event.args.criminalId === undefined) {
				return Result.err({
					type: "TransactionFailedError",
					message: "Could not find 'CriminalProfileRegistered' event or criminal ID argument in receipt.",
				});
			}

			return Result.ok(Number(event.args.criminalId));
		} catch (e: any) {
			console.error(`Write contract call failed for registerCriminalProfile:`, e);
			return Result.err({
				type: "TransactionFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	public async updateCriminalProfile(
		criminalId: number,
		name: string,
		aliases: string[],
		offenses: string[],
		cid: string,
	): Promise<Result<void, UpdateCriminalProfileError>> {
		try {
			const walletClient = this.wallet.getWalletClient();
			const publicClient = this.wallet.getPublicClient();
			const account = this.getAccountAddress();

			const criminalProfileRegistryAddress = await publicClient.readContract({
				address: this.surveillanceSystemAddress,
				abi: surveillanceSystemAbi,
				functionName: "criminalProfileRegistry",
			});

			const { request } = await publicClient.simulateContract({
				address: criminalProfileRegistryAddress,
				abi: criminalProfileRegistryAbi,
				functionName: "updateCriminalProfile",
				args: [BigInt(criminalId), name, aliases, offenses, cid],
				account,
			});

			const hash = await walletClient.writeContract(request);
			await publicClient.waitForTransactionReceipt({ hash });

			return Result.ok(undefined);
		} catch (e: any) {
			console.error(`Write contract call failed for updateCriminalProfile:`, e);
			return Result.err({
				type: "TransactionFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	public async getCriminalProfile(
		criminalId: number,
	): Promise<Result<CriminalProfileDetails, GetCriminalProfileError>> {
		try {
			const publicClient = this.wallet.getPublicClient();

			const criminalProfileRegistryAddress = await publicClient.readContract({
				address: this.surveillanceSystemAddress,
				abi: surveillanceSystemAbi,
				functionName: "criminalProfileRegistry",
			});

			const data = await publicClient.readContract({
				address: criminalProfileRegistryAddress,
				abi: criminalProfileRegistryAbi,
				functionName: "getCriminalProfile",
				args: [BigInt(criminalId)],
			});

			const [id, name, aliases, offenses, cid] = data;
			return Result.ok({ id: Number(id), name, aliases, offenses, cid });
		} catch (e: any) {
			console.error(`Read contract call failed for getCriminalProfile:`, e);
			return Result.err({
				type: "ContractCallFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	// IoT Device Management
	public async registerIoTDevice(
		deviceId: string,
		location: string,
		cid: string,
	): Promise<Result<number, RegisterIoTDeviceError>> {
		try {
			const walletClient = this.wallet.getWalletClient();
			const publicClient = this.wallet.getPublicClient();
			const account = this.getAccountAddress();

			const iotDeviceRegistryAddress = await publicClient.readContract({
				address: this.surveillanceSystemAddress,
				abi: surveillanceSystemAbi,
				functionName: "iotDeviceRegistry",
			});

			const { request } = await publicClient.simulateContract({
				address: iotDeviceRegistryAddress,
				abi: ioTDeviceRegistryAbi,
				functionName: "registerDevice",
				args: [deviceId, location, cid],
				account,
			});

			const hash = await walletClient.writeContract(request);
			const receipt = await publicClient.waitForTransactionReceipt({ hash });

			const logs = parseEventLogs({
				abi: ioTDeviceRegistryAbi,
				logs: receipt.logs,
				eventName: "DeviceRegistered",
			});

			const event = logs.find(
				(log) => log.eventName === "DeviceRegistered",
			);

			if (!event || event.args.deviceId === undefined) {
				return Result.err({
					type: "TransactionFailedError",
					message: "Could not find 'DeviceRegistered' event or device ID argument in receipt.",
				});
			}

			return Result.ok(Number(event.args.deviceId));
		} catch (e: any) {
			console.error(`Write contract call failed for registerIoTDevice:`, e);
			return Result.err({
				type: "TransactionFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	public async getIoTDevice(
		deviceId: number,
	): Promise<Result<IoTDeviceDetails, GetIoTDeviceError>> {
		try {
			const publicClient = this.wallet.getPublicClient();

			const iotDeviceRegistryAddress = await publicClient.readContract({
				address: this.surveillanceSystemAddress,
				abi: surveillanceSystemAbi,
				functionName: "iotDeviceRegistry",
			});

			const deviceAddress = await publicClient.readContract({
				address: iotDeviceRegistryAddress,
				abi: ioTDeviceRegistryAbi,
				functionName: "getDevice",
				args: [BigInt(deviceId)],
			});

			// This is a placeholder. In a real implementation, you would get the details from the device contract itself.
			return Result.ok({ id: deviceId, deviceId: "", location: "", cid: "", admin: "0x" });
		} catch (e: any) {
			console.error(`Read contract call failed for getIoTDevice:`, e);
			return Result.err({
				type: "ContractCallFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	// Surveillance Session Management
	public async createSurveillanceSession(
		cid: string,
	): Promise<Result<number, CreateSurveillanceSessionError>> {
		try {
			const walletClient = this.wallet.getWalletClient();
			const publicClient = this.wallet.getPublicClient();
			const account = this.getAccountAddress();

			const surveillanceSessionRegistryAddress = await publicClient.readContract({
				address: this.surveillanceSystemAddress,
				abi: surveillanceSystemAbi,
				functionName: "surveillanceSessionRegistry",
			});

			const { request } = await publicClient.simulateContract({
				address: surveillanceSessionRegistryAddress,
				abi: surveillanceSessionRegistryAbi,
				functionName: "createSession",
				args: [cid],
				account,
			});

			const hash = await walletClient.writeContract(request);
			const receipt = await publicClient.waitForTransactionReceipt({ hash });

			const logs = parseEventLogs({
				abi: surveillanceSessionRegistryAbi,
				logs: receipt.logs,
				eventName: "SessionCreated",
			});

			const event = logs.find(
				(log) => log.eventName === "SessionCreated",
			);

			if (!event || event.args.sessionId === undefined) {
				return Result.err({
					type: "TransactionFailedError",
					message: "Could not find 'SessionCreated' event or session ID argument in receipt.",
				});
			}

			return Result.ok(Number(event.args.sessionId));
		} catch (e: any) {
			console.error(`Write contract call failed for createSurveillanceSession:`, e);
			return Result.err({
				type: "TransactionFailedError",
				message: "Contract call/execution failed",
			});
		}
	}

	public async getSurveillanceSession(
		sessionId: number,
	): Promise<Result<SurveillanceSessionDetails, GetSurveillanceSessionError>> {
		try {
			const publicClient = this.wallet.getPublicClient();

			const surveillanceSessionRegistryAddress = await publicClient.readContract({
				address: this.surveillanceSystemAddress,
				abi: surveillanceSystemAbi,
				functionName: "surveillanceSessionRegistry",
			});

			const sessionAddress = await publicClient.readContract({
				address: surveillanceSessionRegistryAddress,
				abi: surveillanceSessionRegistryAbi,
				functionName: "getSession",
				args: [BigInt(sessionId)],
			});

			// This is a placeholder. In a real implementation, you would get the details from the session contract itself.
			return Result.ok({ id: sessionId, cid: "", admin: "0x", startTime: 0, endTime: 0, sessionStarted: false, sessionEnded: false });
		} catch (e: any) {
			console.error(`Read contract call failed for getSurveillanceSession:`, e);
			return Result.err({
				type: "ContractCallFailedError",
				message: "Contract call/execution failed",
			});
		}
	}
}

export { BlockchainSurveillanceSystem };
