export abstract class CronJob {
	public abstract schedule(): string;
	public abstract getName(): string;
	public abstract func(): Promise<void>;
}

export abstract class CronService {
	public abstract start(): void;
}
