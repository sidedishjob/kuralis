export interface Category {
  id: number;
  name: string;
}

export interface Location {
  id: number;
  name: string;
}

export interface FurnitureMeta {
  categories: Category[];
  locations: Location[];
}
