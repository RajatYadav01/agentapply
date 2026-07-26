import { prisma, type PrismaClient } from "@agentapply/db";

export abstract class BaseRepository {
	protected readonly db: PrismaClient = prisma;
}
