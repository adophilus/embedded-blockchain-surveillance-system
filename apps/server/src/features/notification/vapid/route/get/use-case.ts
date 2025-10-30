import { Result } from "true-myth";
import type { Response } from "./types";
import { config } from "@/features/config";

export abstract class GetVapidPublicKeyUseCase {
	public abstract execute(): Promise<Result<Response.Success, Response.Error>>;
}

export class GetVapidPublicKeyUseCaseImplementation
	implements GetVapidPublicKeyUseCase {
	public async execute(): Promise<Result<Response.Success, Response.Error>> {
		return Result.ok({
			code: "VAPID_PUBLIC_KEY",
			data: { publicKey: config.notification.vapid.publicKey },
		});
	}
}
