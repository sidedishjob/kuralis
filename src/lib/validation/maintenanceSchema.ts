import { z } from "zod";

export const maintenanceSchema = z.object({});

export type MaintenanceSchema = z.infer<typeof maintenanceSchema>;
