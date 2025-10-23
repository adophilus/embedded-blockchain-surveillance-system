import { Result } from "true-myth";
import type { StorageService, UploadError } from "./interface";
import type { IpfsClient } from "@embedded-blockchain-surveillance-system/core";

export class IpfsStorageService implements StorageService {
	constructor(private readonly client: IpfsClient) {}

	public async upload(payload: File): Promise<Result<string, UploadError>> {
		const uploadResult = await this.client.uploadFile(payload);

		if (uploadResult.isErr) {
			return Result.err("ERR_UNEXPECTED");
		}

		const cid = uploadResult.value;

		return Result.ok(cid);
	}
}
