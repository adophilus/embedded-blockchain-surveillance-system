import "reflect-metadata";

import { Container } from "@n8n/di";
import { HonoApp } from "@/features/app";
import {
	AuthTokenRepository,
	AuthUserRepository,
	KyselyAuthTokenRepository,
	KyselyAuthUserRepository,
} from "@/features/auth/repository";
import { config } from "@/features/config";
import { KyselyClient } from "@/features/database/kysely";
import { createKyselySqliteTestClient } from "@/features/database/kysely/sqlite";
import { Logger } from "@/features/logger";
import { Mailer, MockMailer } from "@/features/mailer";
import { MockStorageService, StorageService } from "@/features/storage/service";
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

export const bootstrap = async () => {
	// Logger
	const logger = new Logger({ name: "App" });

	// Database
	const kyselyClient = await createKyselySqliteTestClient();

	// Storage DI
	const storageService = new MockStorageService();

	// Mailer DI
	const mailer = new MockMailer();

	// Auth DI
	const authUserRepository = new KyselyAuthUserRepository(kyselyClient, logger);
	const authTokenRepository = new KyselyAuthTokenRepository(
		kyselyClient,
		logger,
	);

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

	// Criminal DI
	const criminalProfileRepository = new KyselyCriminalProfileRepository(
		kyselyClient,
		logger,
	);
	const criminalProfileService = new CriminalProfileServiceImplementation(
		criminalProfileRepository,
		logger,
	);

	// IoT DI
	const iotDeviceRepository = new KyselyIotDeviceRepository(
		kyselyClient,
		logger,
	);
	const iotDeviceService = new IotDeviceServiceImplementation(
		iotDeviceRepository,
		logger,
	);

	const app = new HonoApp(logger);

	// Logger DI
	Container.set(Logger, logger);

	// Database DI
	Container.set(KyselyClient, kyselyClient);

	// Storage DI
	Container.set(StorageService, storageService);

	// Mailer DI
	Container.set(Mailer, mailer);

	// Auth DI
	Container.set(AuthUserRepository, authUserRepository);
	Container.set(AuthTokenRepository, authTokenRepository);

	// Surveillance DI
	Container.set(SurveillanceSessionRepository, surveillanceSessionRepository);
	Container.set(SurveillanceEventRepository, surveillanceEventRepository);
	Container.set(SurveillanceSessionService, surveillanceSessionService);
	Container.set(SurveillanceEventService, surveillanceEventService);

	// Criminal DI
	Container.set(CriminalProfileRepository, criminalProfileRepository);
	Container.set(CriminalProfileService, criminalProfileService);

	// IoT DI
	Container.set(IotDeviceRepository, iotDeviceRepository);
	Container.set(IotDeviceService, iotDeviceService);

	return { app, logger, config };
};

const { app: appClass, logger } = await bootstrap();

const app = appClass.create();

export { app, logger };
