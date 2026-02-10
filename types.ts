
export interface Tile {
  id: number;
  correctX: number;
  correctY: number;
  currentX: number;
  currentY: number;
  isMissing: boolean;
}

export interface Point {
  x: number;
  y: number;
}
