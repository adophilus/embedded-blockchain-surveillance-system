import type { Insertable, Selectable, Updateable } from "kysely";
import type { KyselyDatabaseTables } from "./features/database/kysely";
export type { MediaDescription } from "./features/database/kysely/tables";

type ApiCompatibility<T> = T;
type KSelectable<T> = Selectable<T>;
type KInsertable<T> = Insertable<T>;
type KUpdateable<T> = Updateable<T>;

type GenerateTypes<T> = {
	Selectable: ApiCompatibility<KSelectable<T>>;
	Insertable: ApiCompatibility<KInsertable<T>>;
	Updateable: ApiCompatibility<KUpdateable<T>>;
};

export namespace User {
	type T = GenerateTypes<KyselyDatabaseTables["users"]>;
	export type Selectable = T["Selectable"];
	export type Insertable = T["Insertable"];
	export type Updateable = T["Updateable"];
}

export namespace Token {
	type T = GenerateTypes<KyselyDatabaseTables["tokens"]>;
	export type Selectable = T["Selectable"];
	export type Insertable = T["Insertable"];
	export type Updateable = T["Updateable"];
}

export namespace SurveillanceSession {
	type T = GenerateTypes<KyselyDatabaseTables["surveillance_sessions"]>;
	export type Selectable = T["Selectable"];
	export type Insertable = T["Insertable"];
	export type Updateable = T["Updateable"];
}

export namespace SurveillanceEvent {
	type T = GenerateTypes<KyselyDatabaseTables["surveillance_events"]>;
	export type Selectable = T["Selectable"];
	export type Insertable = T["Insertable"];
	export type Updateable = T["Updateable"];
}

export namespace CriminalProfile {
	type T = GenerateTypes<KyselyDatabaseTables["criminal_profiles"]>;
	export type Selectable = T["Selectable"];
	export type Insertable = T["Insertable"];
	export type Updateable = T["Updateable"];
}

export namespace IotDevice {
	type T = GenerateTypes<KyselyDatabaseTables["iot_devices"]>;
	export type Selectable = T["Selectable"];
	export type Insertable = T["Insertable"];
	export type Updateable = T["Updateable"];
}

export namespace File {
	type T = GenerateTypes<KyselyDatabaseTables["files"]>;
	export type Selectable = T["Selectable"];
	export type Insertable = T["Insertable"];
	export type Updateable = T["Updateable"];
}
