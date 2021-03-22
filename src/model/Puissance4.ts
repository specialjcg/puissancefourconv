export enum Ring {
  RED = 1,
  BLUE = 2
}


export type COLUMN = Ring[];
export type LINE = Ring[];
export type DIAG = Ring[];


export const FIRSTREWARD = 0.9;

export const SECONDREWARD = 0.7;

export const THIRDREWARD = 0.5;

export const LASTREWARD = 0.2;

export class Grid {
  gridColumn: COLUMN[];
  getscoreRed: number;
  getscoreBlue: number;
  gridLine: LINE[];
  gridDiagLeft: DIAG[];
  gridDiagRight: DIAG[];
  private readonly LINE = 6;
  private readonly COLUMN = 7;

  constructor() {
    this.gridColumn = Array.from({length: this.COLUMN}).map(() => []);
    this.gridLine = Array.from({length: this.LINE}).map(() => Array.from({length: this.COLUMN}).map(() => 0));
    this.gridDiagLeft = Array.from({length: this.LINE + this.COLUMN}).map(() => Array.from({length: this.COLUMN + this.LINE - 1}).map(() => 0));
    this.gridDiagRight = Array.from({length: this.LINE + this.COLUMN - 1}).map(() => Array.from({length: this.COLUMN + this.LINE - 1}).map(() => 0));

    this.getscoreRed = 0;
    this.getscoreBlue = 0;

  }

  empty(): boolean {

    return this.gridColumn.reduce((noRing, column) => noRing && (column.length === 0), true);
  }

  numberRings(column: number): number {
    if (column > this.COLUMN) {
      throw new Error();
    }
    return this.gridColumn[column - 1].length;
  }

  addRingPlayerRed(column: number): void {

    if (this.numberRings(column) < this.LINE) {
      this.addRing(column, Ring.RED);
    }
  }

  addRingPlayerBlue(column: number): void {
    this.addRing(column, Ring.BLUE);
  }

  getRing(column: number, line: number): Ring {

    return this.gridColumn[column - 1][line - 1];
  }

  win(): boolean {
    return this.IsFourRingFollowingInLine(Ring.BLUE) ||
      this.IsFourRingFollowingInLine(Ring.RED) ||
      this.IsFourRingFollowingInColumn(Ring.BLUE) ||
      this.IsFourRingFollowingInColumn(Ring.RED) ||
      this.IsFourRingFollowingDiagLeft(Ring.BLUE) ||
      this.IsFourRingFollowingDiagLeft(Ring.RED) ||
      this.IsFourRingFollowingDiagRight(Ring.BLUE) ||
      this.IsFourRingFollowingDiagRight(Ring.RED);
  }

  full(): boolean {
    return this.gridColumn.reduce((val, column) => val + column.length, 0) > 41;
  }

  scoreBlue(): number {
    if (this.IsFourRingFollowingInLine(Ring.BLUE) || this.IsFourRingFollowingDiagLeft(Ring.BLUE)
      || this.IsFourRingFollowingDiagRight(Ring.BLUE) || this.IsFourRingFollowingInColumn(Ring.BLUE)) {
      return 1;
    } else if (this.IsFourRingFollowingInLine(Ring.RED) || this.IsFourRingFollowingDiagLeft(Ring.RED)
      || this.IsFourRingFollowingDiagRight(Ring.RED) || this.IsFourRingFollowingInColumn(Ring.RED)) {
      return -1;

    } else if (this.IsLastRingInColumn(Ring.BLUE, Ring.RED) || this.IsLastRingInLine(Ring.BLUE, Ring.RED)
      || this.IsLastRingInDiagLeft(Ring.BLUE, Ring.RED) || this.IsLastRingInDiagRight(Ring.BLUE, Ring.RED)) {
      return FIRSTREWARD;
    } else if (this.IsThreeRingInColumn(Ring.BLUE) || this.IsThreeRingInLine(Ring.BLUE)
      || this.IsThreeRingInDiagLeft(Ring.BLUE) || this.IsThreeRingInDiagRight(Ring.BLUE)) {
      return SECONDREWARD;
    } else if (this.IsTwoRingInColumn(Ring.BLUE) || this.IsTwoRingInLine(Ring.BLUE)
      || this.IsTwoRingInDiagLeft(Ring.BLUE) || this.IsTwoRingInDiagRight(Ring.BLUE)) {
      return THIRDREWARD;
    }
    return LASTREWARD;
  }

  scoreRed(): number {

    if (this.IsFourRingFollowingInLine(Ring.RED) || this.IsFourRingFollowingDiagLeft(Ring.RED)
      || this.IsFourRingFollowingDiagRight(Ring.RED) || this.IsFourRingFollowingInColumn(Ring.RED)) {
      return 1;
    } else if (this.IsFourRingFollowingInLine(Ring.BLUE) || this.IsFourRingFollowingDiagLeft(Ring.BLUE)
      || this.IsFourRingFollowingDiagRight(Ring.BLUE) || this.IsFourRingFollowingInColumn(Ring.BLUE)) {
      return -1;

    } else if (this.IsLastRingInColumn(Ring.RED, Ring.BLUE) || this.IsLastRingInLine(Ring.RED, Ring.BLUE)
      || this.IsLastRingInDiagLeft(Ring.RED, Ring.BLUE) || this.IsLastRingInDiagRight(Ring.RED, Ring.BLUE)) {
      return FIRSTREWARD;
    } else if (this.IsThreeRingInColumn(Ring.RED) || this.IsThreeRingInLine(Ring.RED)
      || this.IsThreeRingInDiagLeft(Ring.RED) || this.IsThreeRingInDiagRight(Ring.RED)) {
      return SECONDREWARD;
    } else if (this.IsTwoRingInColumn(Ring.RED) || this.IsTwoRingInLine(Ring.RED)
      || this.IsTwoRingInDiagLeft(Ring.RED) || this.IsTwoRingInDiagRight(Ring.RED)) {
      return THIRDREWARD;
    }
    return LASTREWARD;
  }


  isInGrid(column: number): boolean {
    return column <= this.COLUMN && this.numberRings(column) < this.LINE;
  }


  rewardBlue(): number {
    const scoreRed = this.scoreRed();
    const scoreBlue = this.scoreBlue();
    if (scoreBlue > scoreRed) {
      return scoreBlue;
    }
    if (scoreRed === scoreBlue) {
      return scoreBlue;
    }

    return -scoreRed;
  }

  rewardRed(): number {
    const scoreRed = this.scoreRed();
    const scoreBlue = this.scoreBlue();
    if (scoreRed > scoreBlue) {
      return scoreRed;
    }
    if (scoreRed === scoreBlue) {
      return scoreRed;
    }

    return -scoreBlue;

  }

  IsLastRingInColumn(ring: Ring, ringAdverse: Ring): boolean {
    return this.gridColumn.some(col => {
      return col.slice(-4, col.length).toString().includes([ringAdverse, ringAdverse, ringAdverse, ring].toString());
    });

  }

  IsLastRingInLine(ring: Ring, ringAdverse: Ring): boolean {
    return this.gridLine.some(line => {
      return line.toString().includes([ring, ringAdverse, ring].toString()) ||
        line.toString().includes([ring, ringAdverse, ringAdverse, ring].toString()) ||
        line.toString().includes([ring, ringAdverse, ringAdverse, ringAdverse, ring].toString()) ||
        line.slice(0, 4).toString().includes([ringAdverse, ringAdverse, ringAdverse, ring].toString());

    });
  }

  IsThreeRingInLine(ring: Ring): boolean {
    return this.gridLine.some(line => {
      return line.toString().includes([ring, ring, ring].toString()) ||
        line.toString().includes([ring, ring, 0, ring].toString()) ||
        line.toString().includes([ring, 0, ring, ring].toString());
    });
  }

  private addRing(column: number, player: Ring): void {
    if (this.isInGrid(column)) {
      this.gridColumn[column - 1].push(player);
      this.gridLine[this.gridColumn[column - 1].length - 1][column - 1] = player;
      this.gridDiagRight[column + this.gridColumn[column - 1].length - 2][column - 1] = player;
      this.gridDiagLeft[this.COLUMN - column + this.gridColumn[column - 1].length][column - 1] = player;

    }

  }

  private IsFourRingFollowingInColumn(ring: Ring): boolean {
    return this.gridColumn.some(column => {
      return column.toString().includes([ring, ring, ring, ring].toString());
    });
  }

  private IsFourRingFollowingInLine(ring: Ring): boolean {
    return this.gridLine.some(line => {
      return line.toString().includes([ring, ring, ring, ring].toString());
    });
  }

  private IsFourRingFollowingDiagLeft(ring: Ring): boolean {
    return this.gridDiagLeft.some(line => {
      return line.toString().includes([ring, ring, ring, ring].toString());
    });
  }

  private IsFourRingFollowingDiagRight(ring: Ring): boolean {
    return this.gridDiagRight.some(line => {
      return line.toString().includes([ring, ring, ring, ring].toString());
    });
  }

  private IsLastRingInDiagLeft(ring: Ring, ringAdverse: Ring): boolean {
    return this.gridDiagLeft.some(line => {
      return line.slice(-4, line.length).toString().includes([ringAdverse, ringAdverse, ringAdverse, ring].toString());
    });
  }

  private IsLastRingInDiagRight(ring: Ring, ringAdverse: Ring): boolean {
    return this.gridDiagRight.some(line => {
      return line.slice(-4, line.length).toString().includes([ringAdverse, ringAdverse, ringAdverse, ring].toString());
    });
  }

  IsThreeRingInColumn(ring: Ring): boolean {
    return this.gridColumn.some(col => {
      return col.toString().includes([ring, ring, ring, 0].toString());
    });
  }

  private IsThreeRingInDiagLeft(ring: Ring): boolean {
    return this.gridDiagLeft.filter(linediag => linediag.length > 3).some(line => {
      return line.slice(-3, line.length).toString().includes([ring, ring, ring].toString());
    });
  }

  private IsThreeRingInDiagRight(ring: Ring): boolean {
    return this.gridDiagRight.filter(linediag => linediag.length > 3).some(line => {
      return line.slice(-3, line.length).toString().includes([ring, ring, ring].toString());
    });
  }

  private IsTwoRingInColumn(ring: Ring): boolean {
    return this.gridColumn.some(col => {
      return col.toString().includes([ring, ring, 0].toString());
    });
  }

  private IsTwoRingInLine(ring: Ring): boolean {
    return this.gridLine.some(line => {
      return line.toString().includes([ring, ring].toString()) ||
        line.toString().includes([ring, 0, ring].toString());
    });
  }

  private IsTwoRingInDiagLeft(ring: Ring): boolean {
    return this.gridDiagLeft.filter(linediag => linediag.length > 3).some(line => {
      return line.slice(-2, line.length).toString().includes([ring, ring].toString());
    });
  }

  private IsTwoRingInDiagRight(ring: Ring): boolean {
    return this.gridDiagRight.filter(linediag => linediag.length > 3).some(line => {
      return line.slice(-2, line.length).toString().includes([ring, ring].toString());
    });
  }
}



