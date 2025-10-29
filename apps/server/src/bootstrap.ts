import "reflect-metadata";

import { Container } from "@n8n/di";
import { App, HonoApp } from "@/features/app";
import {
	AuthUserRepository,
	KyselyAuthUserRepository,
} from "@/features/auth/repository";
import {
	SignInUseCase,
	SignUpUseCase,
	GetUserProfileUseCase,
	SignInUseCaseImplementation,
	SignUpUseCaseImplementation,
} from "@/features/auth/use-case";
import { config } from "@/features/config";
import { KyselyClient } from "@/features/database/kysely";
import { createKyselySqliteClient } from "@/features/database/kysely/sqlite";
import { Logger } from "@/features/logger";
import {
	StorageService,
	SqliteStorageService,
} from "@/features/storage/service";
import {
	CronService,
	CronServiceImplementation,
} from "@/features/cron/service";
import { GetFileUseCase } from "@/features/storage/route/get/use-case";
import { KyselyStorageRepository } from "@/features/storage/repository";
import {
	SurveillanceSessionService,
	SurveillanceSessionServiceImpl,
} from "@/features/surveillance/session/service";
import {
	SurveillanceEventService,
	SurveillanceEventServiceImpl,
} from "@/features/surveillance/events/service";
import {
	SurveillanceSessionRepository,
	KyselySurveillanceSessionRepository,
} from "@/features/surveillance/session/repository";
import {
	SurveillanceEventRepository,
	KyselySurveillanceEventRepository,
} from "@/features/surveillance/events/repository";
import {
	CriminalProfileService,
	CriminalProfileServiceImplementation,
} from "@/features/criminal/service";
import {
	CriminalProfileRepository,
	KyselyCriminalProfileRepository,
} from "@/features/criminal/repository";
import {
	IotDeviceService,
	IotDeviceServiceImplementation,
} from "@/features/iot/service";
import {
	IotDeviceRepository,
	KyselyIotDeviceRepository,
} from "@/features/iot/repository";
import {
	ListSurveillanceSessionsUseCase,
	ListSurveillanceSessionsUseCaseImplementation,
} from "@/features/surveillance/route/list/use-case";
import {
	GetSurveillanceSessionByIdUseCase,
	GetSurveillanceSessionByIdUseCaseImplementation,
} from "@/features/surveillance/route/get/use-case";
import {
	ListSurveillanceEventsUseCase,
	ListSurveillanceEventsUseCaseImplementation,
} from "@/features/surveillance/route/events/use-case";
import {
	GetSurveillanceMetricsUseCase,
	GetSurveillanceMetricsUseCaseImplementation,
} from "@/features/surveillance/route/metrics/use-case";
import {
	IotDeviceUploadUseCase,
	IotDeviceUploadUseCaseImplementation,
} from "@/features/iot/route/upload/use-case";
import {
	IotDeviceHeartbeatUseCase,
	IotDeviceHeartbeatUseCaseImplementation,
} from "@/features/iot/route/heartbeat/use-case";
import {
	CreateCriminalProfileUseCase,
	CreateCriminalProfileUseCaseImplementation,
	GetCriminalProfileByIdUseCase,
	GetCriminalProfileByIdUseCaseImplementation,
	ListCriminalProfilesUseCaseImplementation,
	ListCriminalProfileUseCase,
} from "@/features/criminal/use-case";
import {
	RegisterNotificationTokenUseCase,
	RegisterNotificationTokenUseCaseImplementation,
} from "@/features/notification/token/use-case";
import { SurveillanceSessionCronJob } from "./features/surveillance/session/cron";
import {
	KyselyNotificationTokenRepository,
	NotificationTokenRepository,
} from "@/features/notification/token/repository";
import {
	NotificationTokenService,
	NotificationTokenServiceImpl,
} from "@/features/notification/token/service";

export const bootstrap = async () => {
	const logger = new Logger();

	// Database
	const kyselyClient = await createKyselySqliteClient();

	// Storage DI
	const storageRepository = new KyselyStorageRepository(kyselyClient, logger);
	const storageService = new SqliteStorageService(storageRepository);

	// Auth DI
	const authUserRepository = new KyselyAuthUserRepository(kyselyClient, logger);

	// Surveillance DI
	const surveillanceSessionRepository = new KyselySurveillanceSessionRepository(
		kyselyClient,
		logger,
	);
	const surveillanceEventRepository = new KyselySurveillanceEventRepository(
		kyselyClient,
		logger,
	);
	const surveillanceSessionService = new SurveillanceSessionServiceImpl(
		surveillanceSessionRepository,
		logger,
	);
	const surveillanceEventService = new SurveillanceEventServiceImpl(
		surveillanceEventRepository,
		logger,
	);
	const surveillanceSessionCronJob = new SurveillanceSessionCronJob(
		surveillanceSessionService,
		logger,
	);

	// Criminal DI
	const criminalProfileRepository = new KyselyCriminalProfileRepository(
		kyselyClient,
		logger,
	);
	const criminalProfileService =
		await CriminalProfileServiceImplementation.init(
			criminalProfileRepository,
			logger,
		);
	const createCriminalProfileUseCase =
		new CreateCriminalProfileUseCaseImplementation(
			criminalProfileService,
			storageService,
		);
	const getCriminalProfileByIdUseCase =
		new GetCriminalProfileByIdUseCaseImplementation(criminalProfileService);
	const listCriminalProfileUseCase =
		new ListCriminalProfilesUseCaseImplementation(criminalProfileService);

	// Notification DI
	const notificationTokenRepository = new KyselyNotificationTokenRepository(
		kyselyClient,
		logger,
	);
	const notificationTokenService = new NotificationTokenServiceImpl(
		notificationTokenRepository,
		logger,
	);
	const registerNotificationTokenUseCase =
		new RegisterNotificationTokenUseCaseImplementation(
			notificationTokenService,
			logger,
		);

	// IoT DI
	const iotDeviceRepository = new KyselyIotDeviceRepository(
		kyselyClient,
		logger,
	);
	const iotDeviceService = new IotDeviceServiceImplementation(
		iotDeviceRepository,
		storageService,
	);

	// Auth Use Cases
	const getUserProfileUseCase = new GetUserProfileUseCase();
	const signInUseCase = new SignInUseCaseImplementation(authUserRepository);
	const signUpUseCase = new SignUpUseCaseImplementation(authUserRepository);

	// Cron Service
	const cronService = new CronServiceImplementation(
		[surveillanceSessionCronJob],
		logger,
	);

	// Surveillance Use Cases
	const listSurveillanceSessionsUseCase =
		new ListSurveillanceSessionsUseCaseImplementation(
			surveillanceSessionService,
			logger,
		);
	const getSurveillanceSessionByIdUseCase =
		new GetSurveillanceSessionByIdUseCaseImplementation(
			surveillanceSessionService,
			surveillanceEventService,
			logger,
		);
	const listSurveillanceEventsUseCase =
		new ListSurveillanceEventsUseCaseImplementation(
			surveillanceEventService,
			logger,
		);
	const getSurveillanceMetricsUseCase =
		new GetSurveillanceMetricsUseCaseImplementation(
			surveillanceSessionService,
			surveillanceEventService,
			logger,
		);

	// Storage Use Cases
	const getFileUseCase = new GetFileUseCase(storageRepository, logger);

	// IoT Use Cases
	const iotDeviceUploadUseCase = new IotDeviceUploadUseCaseImplementation(
		iotDeviceService,
		criminalProfileService,
		surveillanceSessionService,
		surveillanceEventService,
		logger,
	);
	const iotDeviceHeartbeatUseCase = new IotDeviceHeartbeatUseCaseImplementation(
		iotDeviceService,
	);

	const app = new HonoApp(logger);

	// App
	Container.set(App, app);

	// Database
	Container.set(KyselyClient, kyselyClient);

	// Storage DI
	Container.set(StorageService, storageService);

	// OpenTelemetry DI
	Container.set(Logger, logger);

	// Auth DI
	Container.set(AuthUserRepository, authUserRepository);

	// Auth Use Cases
	Container.set(GetUserProfileUseCase, getUserProfileUseCase);
	Container.set(SignInUseCase, signInUseCase);
	Container.set(SignUpUseCase, signUpUseCase);

	// Cron Service DI
	Container.set(CronService, cronService);

	// Storage Service DI
	Container.set(GetFileUseCase, getFileUseCase);

	// Surveillance DI
	Container.set(SurveillanceSessionRepository, surveillanceSessionRepository);
	Container.set(SurveillanceEventRepository, surveillanceEventRepository);
	Container.set(SurveillanceSessionService, surveillanceSessionService);
	Container.set(SurveillanceEventService, surveillanceEventService);

	// Criminal DI
	Container.set(CriminalProfileRepository, criminalProfileRepository);
	Container.set(CriminalProfileService, criminalProfileService);
	Container.set(CreateCriminalProfileUseCase, createCriminalProfileUseCase);
	Container.set(GetCriminalProfileByIdUseCase, getCriminalProfileByIdUseCase);
	Container.set(ListCriminalProfileUseCase, listCriminalProfileUseCase);

	// IoT DI
	Container.set(IotDeviceRepository, iotDeviceRepository);
	Container.set(IotDeviceService, iotDeviceService);

	// Notification DI
	Container.set(NotificationTokenRepository, notificationTokenRepository);
	Container.set(NotificationTokenService, notificationTokenService);
	Container.set(
		RegisterNotificationTokenUseCase,
		registerNotificationTokenUseCase,
	);

	// Surveillance Use Cases
	Container.set(
		ListSurveillanceSessionsUseCase,
		listSurveillanceSessionsUseCase,
	);
	Container.set(
		GetSurveillanceSessionByIdUseCase,
		getSurveillanceSessionByIdUseCase,
	);
	Container.set(ListSurveillanceEventsUseCase, listSurveillanceEventsUseCase);
	Container.set(GetSurveillanceMetricsUseCase, getSurveillanceMetricsUseCase);

	// IoT Use Cases
	Container.set(IotDeviceUploadUseCase, iotDeviceUploadUseCase);
	Container.set(IotDeviceHeartbeatUseCase, iotDeviceHeartbeatUseCase);

	return { app, logger, config, cronService };
};
