export interface Furniture {
	id: string;
	user_id: string;
	name: string;
	brand: string;
	category_id: number;
	location_id: number;
	image_url: string;
	purchased_at: string;
	purchased_from: string;
	next_due_date: string;
	notes: string;
}

export type FurnitureWithExtras = Furniture & {
	category?: { id: number; name: string };
	location?: { id: number; name: string };
	needsMaintenance?: boolean;
};
