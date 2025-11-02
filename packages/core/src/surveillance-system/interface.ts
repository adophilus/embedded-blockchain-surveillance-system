import type { Address } from "viem";
import type { Result } from "true-myth";

// Define the structure for contract addresses
export type ContractAddresses = {
	surveillanceSystem: Address;
	criminalProfileRegistry: Address;
	iotDeviceRegistry: Address;
	surveillanceSessionRegistry: Address;
};

export enum IoTDeviceStatus {
	ACTIVE = 0,
	INACTIVE = 1,
	MAINTENANCE = 2,
}

export enum SessionStatus {
	UPCOMING = 0,
	ACTIVE = 1,
	COMPLETED = 2,
}

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
	id: string;
	device_code: string;
	location: string;
	status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
	ip_address: string;
	last_heartbeat: bigint;
};

export type SurveillanceEventDetails = {
	id: string;
	criminal_profile_ids: readonly string[];
	cid: string;
	device_code: string;
	created_at: bigint;
};

export type SurveillanceSessionDetails = {
	id: string;
	title: string;
	description: string;
	start_timestamp: bigint;
	end_timestamp: bigint;
	status: "UPCOMING" | "ACTIVE" | "COMPLETED";
	created_at: bigint;
	updated_at: bigint;
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
export type ListSurveillanceEventsError =
	| SurveillanceSessionNotFoundError
	| ContractCallFailedError
	| UnknownError;
export type RecordSurveillanceEventError =
	| SurveillanceSessionNotFoundError
	| UnauthorizedError
	| TransactionFailedError
	| ContractCallFailedError
	| UnknownError;

export type ListSurveillanceSessionsError = ContractCallFailedError | UnknownError;

export type UpdateSurveillanceSessionStatusError =
	| SurveillanceSessionNotFoundError
	| UnauthorizedError
	| TransactionFailedError
	| ContractCallFailedError
	| UnknownError;

export type UpdateSurveillanceSessionStatusError =
	| SurveillanceSessionNotFoundError
	| UnauthorizedError
	| TransactionFailedError
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
		device_code: string,
		location: string,
		status: "ACTIVE" | "INACTIVE" | "MAINTENANCE",
		ip_address: string,
		last_heartbeat: bigint,
	): Promise<Result<string, RegisterIoTDeviceError>>;
	getIoTDevice(
		deviceId: string,
	): Promise<Result<IoTDeviceDetails, GetIoTDeviceError>>;

	// Surveillance Session Management
	createSurveillanceSession(
		id: string,
		title: string,
		description: string,
		start_timestamp: bigint,
		end_timestamp: bigint,
		status: "UPCOMING" | "ACTIVE" | "COMPLETED",
	): Promise<Result<string, CreateSurveillanceSessionError>>;
	getSurveillanceSession(
		sessionId: string,
	): Promise<Result<SurveillanceSessionDetails, GetSurveillanceSessionError>>;
	getActiveSurveillanceSession(): Promise<Result<SurveillanceSessionDetails, GetSurveillanceSessionError>>;
	listSurveillanceEvents(
		sessionId: string,
	): Promise<Result<SurveillanceEventDetails[], ListSurveillanceEventsError>>;
	recordSurveillanceEvent(
		sessionId: string,
		id: string,
		criminal_profile_ids: string[],
		cid: string,
		device_code: string,
	): Promise<Result<string, RecordSurveillanceEventError>>;
	listSurveillanceSessions(): Promise<Result<SurveillanceSessionDetails[], ListSurveillanceSessionsError>>;
	updateSurveillanceSessionStatus(
		sessionId: string,
		status: "UPCOMING" | "ACTIVE" | "COMPLETED",
	): Promise<Result<void, UpdateSurveillanceSessionStatusError>>;
}
