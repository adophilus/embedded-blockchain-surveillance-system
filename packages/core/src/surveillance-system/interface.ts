import type { Address } from "viem";
import type { Result } from "true-myth";

// Define the structure for contract addresses
export type ContractAddresses = {
	surveillanceSystem: Address;
	criminalProfileRegistry: Address;
	iotDeviceRegistry: Address;
	surveillanceSessionRegistry: Address;
};

// Placeholder types for data structures
export type CriminalProfileDetails = {
	id: string;
	name: string;
	aliases: readonly string[];
	offenses: readonly string[];
	cid: string;
	created_at: bigint;
	updated_at: bigint;
};

export type IoTDeviceDetails = {
	id: number;
	deviceId: string;
	location: string;
	cid: string;
};

export type SurveillanceSessionDetails = {
	id: number;
	cid: string;
	admin: Address;
	startTime: number;
	endTime: number;
	sessionStarted: boolean;
	sessionEnded: boolean;
};

// --- Individual Error Types ---
export type InvalidAddressError = {
	type: "InvalidAddressError";
	message: string;
};
export type UnauthorizedError = { type: "UnauthorizedError"; message: string };
export type TransactionFailedError = {
	type: "TransactionFailedError";
	message: string;
};
export type ContractCallFailedError = {
	type: "ContractCallFailedError";
	message: string;
};
export type CriminalProfileNotFoundError = {
	type: "CriminalProfileNotFoundError";
	message: string;
};
export type IoTDeviceNotFoundError = {
	type: "IoTDeviceNotFoundError";
	message: string;
};
export type SurveillanceSessionNotFoundError = {
	type: "SurveillanceSessionNotFoundError";
	message: string;
};
export type UnknownError = { type: "UnknownError"; message: string };

// --- Method-Specific Error Types ---

// Criminal Profile Management
export type RegisterCriminalProfileError =
	| UnauthorizedError
	| TransactionFailedError
	| ContractCallFailedError
	| UnknownError;
export type GetCriminalProfileError =
	| CriminalProfileNotFoundError
	| ContractCallFailedError
	| UnknownError;

// IoT Device Management
export type RegisterIoTDeviceError =
	| UnauthorizedError
	| TransactionFailedError
	| ContractCallFailedError
	| UnknownError;
export type GetIoTDeviceError =
	| IoTDeviceNotFoundError
	| ContractCallFailedError
	| UnknownError;

// Surveillance Session Management
export type CreateSurveillanceSessionError =
	| UnauthorizedError
	| TransactionFailedError
	| ContractCallFailedError
	| UnknownError;
export type GetSurveillanceSessionError =
	| SurveillanceSessionNotFoundError
	| ContractCallFailedError
	| UnknownError;

export type ListCriminalProfilesError = ContractCallFailedError | UnknownError;

export interface SurveillanceSystem {
	// Criminal Profile Management
	registerCriminalProfile(
		name: string,
		aliases: string[],
		offenses: string[],
		cid: string,
	): Promise<Result<string, RegisterCriminalProfileError>>;
	getCriminalProfile(
		criminalId: string,
	): Promise<Result<CriminalProfileDetails, GetCriminalProfileError>>;
	listCriminalProfiles(): Promise<
		Result<CriminalProfileDetails[], ListCriminalProfilesError>
	>;

	// IoT Device Management
	registerIoTDevice(
		deviceId: string,
		location: string,
		cid: string,
	): Promise<Result<number, RegisterIoTDeviceError>>;
	getIoTDevice(
		deviceId: number,
	): Promise<Result<IoTDeviceDetails, GetIoTDeviceError>>;

	// Surveillance Session Management
	createSurveillanceSession(
		cid: string,
	): Promise<Result<number, CreateSurveillanceSessionError>>;
	getSurveillanceSession(
		sessionId: number,
	): Promise<Result<SurveillanceSessionDetails, GetSurveillanceSessionError>>;
}
