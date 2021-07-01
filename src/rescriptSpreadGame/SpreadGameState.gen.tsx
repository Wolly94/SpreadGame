/* TypeScript file generated from SpreadGameState.res by genType. */
/* eslint-disable import/first */


import type {bubble as Bubble_bubble} from './Bubble.gen';

import type {cell as Cell_cell} from './Cell.gen';

// tslint:disable-next-line:interface-over-type-literal
export type gameState = { readonly cells: Cell_cell[]; readonly bubbles: Bubble_bubble[] };
