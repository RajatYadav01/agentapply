import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "@agentapply/config";
import { PrismaClient } from "../generated/prisma/client.ts";

const connectionString = `${config.database.url}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export const db = prisma;

export { prisma, PrismaClient };
