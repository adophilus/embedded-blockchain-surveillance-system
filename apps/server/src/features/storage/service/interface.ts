import type { Result } from "true-myth";

export type UploadError = "ERR_UNEXPECTED";

export abstract class StorageService {
	public abstract upload(payload: File): Promise<Result<string, UploadError>>;
}
