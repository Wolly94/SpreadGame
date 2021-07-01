/* TypeScript file generated from Bubble.res by genType. */
/* eslint-disable import/first */


import type {direction as Direction2D_direction} from '../../src/rescriptSpreadGame/common/Direction2D.gen';

import type {vector as Vector2D_vector} from '../../src/rescriptSpreadGame/common/Vector2D.gen';

// tslint:disable-next-line:interface-over-type-literal
export type bubble = {
  readonly id: number; 
  readonly ownerId: number; 
  readonly units: number; 
  readonly radius: number; 
  readonly position: Vector2D_vector; 
  readonly direction: Direction2D_direction; 
  readonly targetCellId: number; 
  readonly targetCellPosition: Vector2D_vector
};
