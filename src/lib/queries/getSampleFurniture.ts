// lib/queries/getSampleFurniture.ts
import { sampleFurniture } from "@/data/sampleFurniture";

export async function getSampleFurniture() {
	// 将来のDB対応にも備えて async にしておく
	return sampleFurniture;
}
