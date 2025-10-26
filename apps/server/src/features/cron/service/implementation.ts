import type { Logger } from "@/features/logger";
import cron from "node-cron";
import type { CronJob, CronService } from "./interface";

export class CronServiceImplementation implements CronService {
	constructor(
		private jobs: CronJob[],
		private logger: Logger,
	) {}

	start() {
		for (const job of this.jobs) {
			this.logger.info(`Registering cron job: ${job.getName()}`);
			cron.schedule(job.schedule(), async () => {
				this.logger.info(`Executing cron job: ${job.getName()}`);
				try {
					await job.func();
					this.logger.info(`Cron job ${job.getName()} completed successfully`);
				} catch (error) {
					this.logger.error(
						`Error executing cron job ${job.getName()}:`,
						error,
					);
				}
			});
		}

		this.logger.info("Cron service started");
	}
}
