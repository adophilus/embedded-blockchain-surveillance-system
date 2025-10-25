import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	// Add indexes for better query performance
	await db.schema
		.createIndex("idx_users_email")
		.on("users")
		.column("email")
		.execute();

	await db.schema
		.createIndex("idx_tokens_user_id")
		.on("tokens")
		.column("user_id")
		.execute();

	await db.schema
		.createIndex("idx_surveillance_events_session_id")
		.on("surveillance_events")
		.column("session_id")
		.execute();

	await db.schema
		.createIndex("idx_surveillance_events_device_id")
		.on("surveillance_events")
		.column("device_id")
		.execute();

	await db.schema
		.createIndex("idx_surveillance_events_created_at")
		.on("surveillance_events")
		.column("created_at")
		.execute();

	await db.schema
		.createIndex("idx_criminal_profiles_name")
		.on("criminal_profiles")
		.column("name")
		.execute();

	await db.schema
		.createIndex("idx_iot_devices_device_code")
		.on("iot_devices")
		.column("device_code")
		.execute();

	await db.schema
		.createIndex("idx_iot_devices_status")
		.on("iot_devices")
		.column("status")
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	// Drop indexes
	await db.schema.dropIndex("idx_iot_devices_status").execute();
	await db.schema.dropIndex("idx_iot_devices_device_code").execute();
	await db.schema.dropIndex("idx_criminal_profiles_name").execute();
	await db.schema.dropIndex("idx_surveillance_events_created_at").execute();
	await db.schema.dropIndex("idx_surveillance_events_device_id").execute();
	await db.schema.dropIndex("idx_surveillance_events_session_id").execute();
	await db.schema.dropIndex("idx_tokens_user_id").execute();
	await db.schema.dropIndex("idx_users_email").execute();
}
