import {Queue} from "bullmq";
import redis  from "../config/redis.js"

export const ingestQueue = new Queue("ingest-queue", {
    connection : redis
});