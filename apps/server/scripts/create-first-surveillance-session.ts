import { Container } from "@n8n/di";
import { bootstrap } from "@embedded-blockchain-surveillance-system/server";
import { ulid } from "ulidx";
import type { SurveillanceSession } from "@/types";
import { addDays, getUnixTime, startOfDay } from "date-fns";
import { SurveillanceSessionService } from "@/features/surveillance/session";

await bootstrap();

const getNextDayMidnightTimestamp = (timestamp: number): number => {
	const nextDay = addDays(timestamp, 1);
	const midnightNextDay = startOfDay(nextDay);
	return getUnixTime(midnightNextDay);
};

const startTimestamp = getUnixTime(new Date());

const surveillanceSessionPayload: SurveillanceSession.Insertable = {
	id: ulid(),
	title: "Routine surveillance focusing on known organized crime areas.",
	end_timestamp: getNextDayMidnightTimestamp(startTimestamp),
	start_timestamp: startTimestamp,
	status: "ACTIVE",
} as const;

const surveillanceSessionService = Container.get(SurveillanceSessionService);

const createSurveillanceSession = async (
	service: SurveillanceSessionService,
) => {
	const surveillanceSessionsListResult = await service.list();
	if (surveillanceSessionsListResult.isErr) {
		console.log("❌ Failed to check existing surveillance sessions");
		return;
	}

	if (surveillanceSessionsListResult.value.length > 0) {
		console.log("❌ Surveillance session already exists");
		return;
	}

	const createSurveillanceSessionResult = await service.create(
		surveillanceSessionPayload,
	);

	if (createSurveillanceSessionResult.isErr) {
		console.log("❌ Failed to create surveillance session");
		return;
	}

	console.log("✅ Surveillance session created");
};

await createSurveillanceSession(surveillanceSessionService);
