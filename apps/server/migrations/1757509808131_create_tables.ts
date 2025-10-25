import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	// Users table
	await db.schema
		.createTable("users")
		.addColumn("id", "text", (col) => col.primaryKey())
		.addColumn("full_name", "text", (col) => col.notNull())
		.addColumn("email", "text", (col) => col.notNull().unique())
		.addColumn("password_hash", "text", (col) => col.notNull())
		.addColumn("role", "text", (col) => col.notNull())
		.addColumn("created_at", "integer", (col) =>
			col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
		)
		.addColumn("updated_at", "integer")
		.execute();

	// Tokens table
	await db.schema
		.createTable("tokens")
		.addColumn("id", "text", (col) => col.primaryKey())
		.addColumn("user_id", "text", (col) => col.notNull().references("users.id"))
		.addColumn("purpose", "text", (col) => col.notNull())
		.addColumn("token", "text", (col) => col.notNull().unique())
		.addColumn("expires_at", "text", (col) => col.notNull())
		.addColumn("used_at", "text")
		.addColumn("created_at", "integer", (col) =>
			col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
		)
		.addColumn("updated_at", "integer")
		.execute();

	// Surveillance Sessions table
	await db.schema
		.createTable("surveillance_sessions")
		.addColumn("id", "text", (col) => col.primaryKey())
		.addColumn("title", "text", (col) => col.notNull())
		.addColumn("description", "text")
		.addColumn("start_timestamp", "text", (col) => col.notNull())
		.addColumn("end_timestamp", "text", (col) => col.notNull())
		.addColumn("status", "text", (col) => col.notNull())
		.addColumn("created_at", "integer", (col) =>
			col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
		)
		.addColumn("updated_at", "integer")
		.execute();

	// Surveillance Events table
	await db.schema
		.createTable("surveillance_events")
		.addColumn("id", "text", (col) => col.primaryKey())
		.addColumn("session_id", "text", (col) =>
			col.notNull().references("surveillance_sessions.id"),
		)
		.addColumn("device_id", "text", (col) => col.notNull())
		.addColumn("timestamp", "text", (col) => col.notNull())
		.addColumn("detected", "integer", (col) => col.notNull()) // SQLite uses integer for boolean
		.addColumn("media_source", "text")
		.addColumn("media_id", "text")
		.addColumn("media_url", "text")
		.addColumn("created_at", "integer", (col) =>
			col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
		)
		.execute();

	// Criminals table
	await db.schema
		.createTable("criminals")
		.addColumn("id", "text", (col) => col.primaryKey())
		.addColumn("name", "text", (col) => col.notNull())
		.addColumn("aliases", "text", (col) => col.notNull()) // JSON stringified array
		.addColumn("offense", "text")
		.addColumn("mugshot_source", "text") // 'ipfs' or other sources
		.addColumn("mugshot_id", "text") // CID or other identifier
		.addColumn("mugshot_url", "text") // Full URL to the mugshot
		.addColumn("created_at", "integer", (col) =>
			col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
		)
		.addColumn("updated_at", "integer")
		.execute();

	// IoT Devices table
	await db.schema
		.createTable("iot_devices")
		.addColumn("id", "text", (col) => col.primaryKey())
		.addColumn("device_code", "text", (col) => col.notNull().unique())
		.addColumn("location", "text", (col) => col.notNull())
		.addColumn("status", "text", (col) => col.notNull())
		.addColumn("ip_address", "text")
		.addColumn("last_heartbeat", "text")
		.addColumn("created_at", "integer", (col) =>
			col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
		)
		.addColumn("updated_at", "integer")
		.execute();

	// Files table
	await db.schema
		.createTable("files")
		.addColumn("id", "text", (col) => col.primaryKey())
		.addColumn("original_name", "text", (col) => col.notNull())
		.addColumn("file_data", "blob", (col) => col.notNull()) // Binary data for SQLite
		.addColumn("mime_type", "text", (col) => col.notNull())
		.addColumn("created_at", "integer", (col) =>
			col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
		)
		.addColumn("updated_at", "integer")
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("files").execute();
	await db.schema.dropTable("iot_devices").execute();
	await db.schema.dropTable("criminal_profiles").execute();
	await db.schema.dropTable("surveillance_events").execute();
	await db.schema.dropTable("surveillance_sessions").execute();
	await db.schema.dropTable("tokens").execute();
	await db.schema.dropTable("users").execute();
}
