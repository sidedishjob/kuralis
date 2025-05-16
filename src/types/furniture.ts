export interface Furniture {
	id: string;
	name: string;
	brand: string;
	category: string;
	location: string;
	needsMaintenance: boolean;
	imageUrl?: string;
	purchaseDate?: string;
	purchaseLocation?: string;
	maintenanceMethod?: string;
	notes?: string;
}
