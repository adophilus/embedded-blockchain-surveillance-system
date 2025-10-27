import type { types } from "@embedded-blockchain-surveillance-system/api";

export type CriminalProfile =
	types.components["schemas"]["Api.Criminal.ById.Response.Success.CriminalProfileDetails"]["data"];
export type SurveillanceSession =
	types.components["schemas"]["Api.Surveillance.Session"];
export type SurveillanceEvent =
	types.components["schemas"]["Api.Surveillance.ById.Event.List.Response.Success.EventsList"]["data"]["data"][number];
