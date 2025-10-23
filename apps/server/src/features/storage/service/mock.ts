import { Result } from "true-myth";
import type { StorageService, UploadError } from "./interface";
import { ulid } from "ulidx";
import type { MediaDescription } from "@/types";

export class MockStorageService implements StorageService {
	private files: Record<string, File> = {};

	public async upload(
		payload: File,
	): Promise<Result<MediaDescription, UploadError>> {
		try {
			const id = ulid();

			this.files[id] = payload;

			return Result.ok({
				id,
				source: "mock",
				url: `http://mock.url/${id}`,
			});
		} catch (error) {
			return Result.err("ERR_UNEXPECTED");
		}
	}
}
