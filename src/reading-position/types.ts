export interface ReadingPosition {
	lineStart: number;
	scrollRatio: number;
	updatedAt: number;
}

export type ReadingPositionStore = Record<string, ReadingPosition>;
