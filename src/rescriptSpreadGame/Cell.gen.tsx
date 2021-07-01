/* TypeScript file generated from Cell.res by genType. */
/* eslint-disable import/first */


import type {vector as Vector2D_vector} from '../../src/rescriptSpreadGame/common/Vector2D.gen';

// tslint:disable-next-line:interface-over-type-literal
export type cell = {
  readonly id: number; 
  readonly ownerId?: number; 
  readonly units: number; 
  readonly radius: number; 
  readonly position: Vector2D_vector
};
