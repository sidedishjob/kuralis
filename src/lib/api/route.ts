export const API_ROUTES = {
	furniture: "/api/furniture",
	furnitureById: (id: string) => `/api/furniture/${id}`,
	furnitureMeta: "/api/furniture/meta",
	maintenanceRecord: "/api/maintenance/record",
	maintenanceTasks: (id: string) => `/api/maintenance/tasks?furnitureId=${id}`,
};
