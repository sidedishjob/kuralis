export const API_ROUTES = {
	furniture: "/api/furniture",
	furnitureById: (id: string) => `/api/furniture/${id}`,
	maintenanceTasks: (id: string) => `/api/furniture/${id}/tasks`,
	maintenanceTasksById: (id: string, taskId: string) => `/api/furniture/${id}/tasks/${taskId}`,
	furnitureMeta: "/api/furniture/meta",
	maintenanceRecord: "/api/maintenance/record",
	maintenanceRecordById: (id: string) => `/api/maintenance/record/${id}`,
};
