import type { ColumnType } from "kysely";
import type { types } from "@embedded-blockchain-surveillance-system/api";

export type MediaDescription =
	types.components["schemas"]["Api.MediaDescription"];

type Id = ColumnType<string, string, never>;

type TimestampModel = {
	created_at: ColumnType<number, never, never>;
	updated_at: ColumnType<number | null, never, number>;
};

type Detection = {
	criminal_profile_id: string;
};

type UsersTable = TimestampModel & {
	id: Id;
	full_name: string;
	email: string;
	password_hash: string;
	role: "ADMIN" | "OFFICIAL";
};

type TokensTable = TimestampModel & {
	id: Id;
	user_id: string;
	purpose: string;
	token: string;
	expires_at: string;
	used_at: string | null;
};

type SurveillanceSessionsTable = TimestampModel & {
	id: Id;
	title: string;
	description: string;
	start_timestamp: number;
	end_timestamp: number;
	status: "UPCOMING" | "ACTIVE" | "COMPLETED";
};

type SurveillanceEventsTable = {
	id: Id;
	detections: Detection[];
	media: MediaDescription;
	device_id: string;
	session_id: string;
	created_at: ColumnType<number, never, never>;
};

type CriminalProfilesTable = TimestampModel & {
	id: Id;
	name: string;
	aliases: string[];
	offenses: string[];
	mugshot: MediaDescription | null;
};

type IoTDevicesTable = TimestampModel & {
	id: Id;
	device_code: string;
	location: string;
	status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
	ip_address: string | null;
	last_heartbeat: string | null;
};

type FilesTable = TimestampModel & {
	id: Id;
	original_name: string;
	file_data: Buffer;
	mime_type: string;
};

type NotificationMeta = {
	type: "web-push";
	data: {
		endpoint: string;
		keys: {
			p256dh: string;
			auth: string;
		};
		supported_content_encodings: string[];
	};
};

type NotificationTokensTable = TimestampModel & {
	id: Id;
	meta: NotificationMeta;
	subscription_id: string;
	user_id: string;
};

export type KyselyDatabaseTables = {
	users: UsersTable;
	tokens: TokensTable;
	surveillance_sessions: SurveillanceSessionsTable;
	surveillance_events: SurveillanceEventsTable;
	criminal_profiles: CriminalProfilesTable;
	iot_devices: IoTDevicesTable;
	files: FilesTable;
	notification_tokens: NotificationTokensTable;
};
