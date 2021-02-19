import {COLUMN, Grid} from '../model/Puissance4';

export interface RestGrid {
  grid: COLUMN[];
}

export const toGrid = (grid: Grid): RestGrid => ({
  grid: grid.gridColumn,

});
