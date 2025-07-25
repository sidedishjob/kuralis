export interface Furniture {
	id: string;
	user_id: string;
	name: string;
	brand: string;
	category_id: number;
	location_id: number;
	image_url: string | null;
	purchased_at: string | null;
	purchased_from: string | null;
	next_due_date: string | null;
	notes: string | null;
}

export type FurnitureWithExtras = Furniture & {
	category?: { id: number; name: string };
	location?: { id: number; name: string };
	needsMaintenance?: boolean;
};

export type UpdateFurniturePayload = {
	name: string;
	location_id: number;
	updated_at: string;
	brand?: string;
	image_url?: string;
	purchased_at?: string | null;
	purchased_from?: string;
	notes?: string;
};
