import type { Request, Response } from "../types";
import { Result } from "true-myth";
import type { SignUpUseCase } from "./interface";
import type { AuthUserRepository } from "@/features/auth/repository";
import { hashPassword } from "@/features/auth/utils/password";
import { ulid } from "ulidx";

export class SignUpUseCaseImplementation implements SignUpUseCase {
	constructor(private readonly authUserRepository: AuthUserRepository) {}

	async execute(
		payload: Request.Body,
	): Promise<Result<Response.Success, Response.Error>> {
		const existingUserResult = await this.authUserRepository.findByEmail(
			payload.email,
		);
		if (existingUserResult.isErr) {
			return Result.err({
				code: "ERR_UNEXPECTED",
			});
		}

		const existingUser = existingUserResult.value;
		if (existingUser) {
			return Result.err({
				code: "ERR_EMAIL_ALREADY_IN_USE",
			});
		}

		const { password, ..._payload } = payload;

		const hashedPassword = await hashPassword(password);

		const userCreationResult = await this.authUserRepository.create({
			..._payload,
			password_hash: hashedPassword,
			role: payload.role || "OFFICIAL",
			id: ulid(),
		});

		if (userCreationResult.isErr) {
			return Result.err({
				code: "ERR_UNEXPECTED",
			});
		}

		return Result.ok({
			code: "USER_CREATED",
		});
	}
}
