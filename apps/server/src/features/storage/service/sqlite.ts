import { Result } from "true-myth";
import type { StorageService, UploadError } from "./interface";
import type { StorageRepository } from "../repository/interface";
import { ulid } from "ulidx";

export class SqliteStorageService implements StorageService {
	constructor(private readonly repository: StorageRepository) {}

	public async upload(payload: File): Promise<Result<string, UploadError>> {
		const creationResult = await this.repository.create({
			id: ulid(),
			mime_type: payload.type,
			original_name: payload.name,
			file_data: Buffer.from(await payload.arrayBuffer()),
		});

		if (creationResult.isErr) {
			return Result.err("ERR_UNEXPECTED");
		}

		const uploadedFile = creationResult.value;
		return Result.ok(uploadedFile.id);
	}
}
