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

// export interface Furniture {
// 	id: string;
// 	user_id: string;
// 	name: string;
// 	brand: string;
// 	category_id: string;
// 	location_id: string;
// 	image_url: string;
// 	purchase_date: string;
// 	purchase_location: string;
// 	notes: string;
// }
