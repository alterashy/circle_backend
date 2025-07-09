"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serverless_1 = require("@neondatabase/serverless");
const adapter_neon_1 = require("@prisma/adapter-neon");
const client_1 = require("@prisma/client");
require("dotenv/config");
const ws_1 = __importDefault(require("ws"));
serverless_1.neonConfig.webSocketConstructor = ws_1.default;
// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
serverless_1.neonConfig.poolQueryViaFetch = true;
const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new adapter_neon_1.PrismaNeon({ connectionString });
const prisma = global.prisma || new client_1.PrismaClient({ adapter });
if (process.env.NODE_ENV === "development")
    global.prisma = prisma;
exports.default = prisma;
