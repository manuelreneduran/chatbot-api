import cron from "node-cron";
import { reactToNewMessages } from "./reactToNewMessages";

// Schedule the scan to run every 5 seconds
cron.schedule("*/5 * * * * *", reactToNewMessages);
