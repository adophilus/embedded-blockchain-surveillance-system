import type { ColumnType } from "kysely";
import type { types } from "@embedded-blockchain-surveillance-system/api";

export type MediaDescription =
	types.components["schemas"]["Api.MediaDescription"];

type TimestampModel = {
	created_at: ColumnType<number, never, never>;
	updated_at: ColumnType<number | null, never, number>;
};

type UsersTable = TimestampModel & {
	id: string;
	full_name: string;
	email: string;
	password_hash: string;
	role: "ADMIN" | "OFFICIAL" | "SYSTEM";
};

type TokensTable = TimestampModel & {
	id: string;
	user_id: string;
	purpose: string;
	token: string;
	expires_at: string;
	used_at: string | null;
};

type SurveillanceSessionsTable = TimestampModel & {
	id: string;
	title: string;
	description: string | null;
	start_timestamp: string;
	end_timestamp: string;
	status: "UPCOMING" | "ACTIVE" | "COMPLETED";
};

type SurveillanceEventsTable = {
	id: string;
	session_id: string;
	device_id: string;
	timestamp: string;
	detected: boolean;
	media_source: string | null;
	media_id: string | null;
	media_url: string | null;
	created_at: ColumnType<number, never, never>;
};

type CriminalsTable = TimestampModel & {
	id: string;
	name: string;
	aliases: string[];
	offense: string | null;
	mugshot: MediaDescription | null;
};

type IoTDevicesTable = TimestampModel & {
	id: string;
	device_code: string;
	location: string;
	status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
	ip_address: string | null;
	last_heartbeat: string | null;
};

type FilesTable = TimestampModel & {
	id: string;
	original_name: string;
	file_data: Buffer;
	mime_type: string;
};

export type KyselyDatabaseTables = {
	users: UsersTable;
	tokens: TokensTable;
	surveillance_sessions: SurveillanceSessionsTable;
	surveillance_events: SurveillanceEventsTable;
	criminals: CriminalsTable;
	iot_devices: IoTDevicesTable;
	files: FilesTable;
};
