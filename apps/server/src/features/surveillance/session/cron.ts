import type { CronJob } from "@/features/cron/service";
import type { SurveillanceSessionService } from "./service";
import type { Logger } from "@/features/logger";

export class SurveillanceSessionCronJob implements CronJob {
	constructor(
		private readonly service: SurveillanceSessionService,
		private readonly logger: Logger,
	) {}

	public schedule(): string {
		return "0 0 * * *";
	}

	public getName(): string {
		return "SurveillanceSessionCleanupJob";
	}

	public async func(): Promise<void> {
		const result = await this.service.rotateActiveSession();
		if (result.isErr) {
			this.logger.error(
				`Failed to rotate active surveillance session: ${result.error}`,
			);
			return;
		}
	}
}
