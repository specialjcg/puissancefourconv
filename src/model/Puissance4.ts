export enum Ring {
  RED = 1,
  BLUE = 2
}


export type COLUMN = Ring[];
export type LINE = Ring[];


const FIRSTREWARD = 0.8;

const SECONDREWARD = 0.6;

const THIRDREWARD = 0.4;

const LASTREWARD = 0.2;

export class Grid {
  gridColumn: COLUMN[];
  getscoreRed: number;
  getscoreBlue: number;
  gridLine: LINE[];
  private readonly LINE = 6;
  private readonly COLUMN = 7;

  constructor() {
    this.gridColumn = Array.from({length: this.COLUMN}).map(() => []);
    this.gridLine = Array.from({length: this.LINE}).map(() => []);

    this.getscoreRed = -LASTREWARD;
    this.getscoreBlue = -LASTREWARD;

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
    return this.gridColumn.reduce((val, column) => val + column.length, 0) === 42;
  }

  scoreBlue(): number {


    const scoreColumnBlue = this.ScoreRingFollowingInColumn(Ring.BLUE);
    const scoreColumnRed = this.ScoreRingFollowingInColumn(Ring.RED);
    const scoreLineBlue = this.ScoreRingFollowingInLinen(Ring.BLUE);
    const scoreLineRed = this.ScoreRingFollowingInLinen(Ring.RED);
    const scorediagBlue = this.ScoreRingFollowingInDiag(Ring.BLUE);
    const scorediagRed = this.ScoreRingFollowingInDiag(Ring.RED);
    const scoreRingFollowCollumn = this.ScoreRingFollowingCollumn(Ring.BLUE, Ring.RED);
    const scoreRingFollowLine = this.ScoreRingFollowingLine(Ring.BLUE, Ring.RED);
    const scorediagBlueFollowLine = this.ScorediagFollowing(Ring.BLUE, Ring.RED);
    if (scorediagBlueFollowLine < 0 && this.getscoreBlue > scorediagBlueFollowLine) {
      this.getscoreBlue = scorediagBlueFollowLine;
    }
    if (scoreRingFollowCollumn < 0 && this.getscoreBlue > scoreRingFollowCollumn) {
      this.getscoreBlue = scoreRingFollowCollumn;
    }
    if (scoreRingFollowLine < 0 && this.getscoreBlue > scoreRingFollowLine) {
      this.getscoreBlue = scoreRingFollowLine;
    }
    if (scoreRingFollowCollumn > 0 && this.getscoreBlue > scoreRingFollowCollumn) {
      this.getscoreBlue = scoreRingFollowCollumn;
    }
    if (scoreRingFollowLine > 0 && this.getscoreBlue > scoreRingFollowLine) {
      this.getscoreBlue = scoreRingFollowLine;
    }
    if (scorediagBlueFollowLine > 0 && this.getscoreBlue > scorediagBlueFollowLine) {
      this.getscoreBlue = scorediagBlueFollowLine;
    }

    if (this.getscoreBlue < scoreColumnBlue) {
      this.getscoreBlue = scoreColumnBlue;
    }
    if (this.getscoreBlue < scoreLineBlue) {
      this.getscoreBlue = scoreLineBlue;
    }
    if (this.getscoreBlue < scorediagBlue) {
      this.getscoreBlue = scorediagBlue;
    }
    if (this.getscoreBlue <= scoreColumnRed || this.getscoreBlue <= scoreLineRed || this.getscoreBlue <= scorediagRed ) {
      this.getscoreBlue = -1;

    }
    return this.getscoreBlue;
  }

  scoreRed(): number {

    const scoreColumnBlue = this.ScoreRingFollowingInColumn(Ring.BLUE);
    const scoreColumnRed = this.ScoreRingFollowingInColumn(Ring.RED);
    const scoreLineBlue = this.ScoreRingFollowingInLinen(Ring.BLUE);
    const scoreLineRed = this.ScoreRingFollowingInLinen(Ring.RED);
    const scorediagBlue = this.ScoreRingFollowingInDiag(Ring.BLUE);
    const scorediagRed = this.ScoreRingFollowingInDiag(Ring.RED);
    const scoreRingFollowCollumn = this.ScoreRingFollowingCollumn(Ring.RED, Ring.BLUE);
    const scoreRingFollowLine = this.ScoreRingFollowingLine(Ring.RED, Ring.BLUE);
    const scorediagBlueFollowLine = this.ScorediagFollowing(Ring.RED, Ring.BLUE);
    if (scorediagBlueFollowLine < 0 && this.getscoreRed > scorediagBlueFollowLine) {
      this.getscoreRed = scorediagBlueFollowLine;
    }
    if (scoreRingFollowCollumn < 0 && this.getscoreRed > scoreRingFollowCollumn) {
      this.getscoreRed = scoreRingFollowCollumn;
    }
    if (scoreRingFollowLine < 0 && this.getscoreRed > scoreRingFollowLine) {
      this.getscoreRed = scoreRingFollowLine;
    }
    if (scoreRingFollowCollumn > 0 && this.getscoreRed > scoreRingFollowCollumn) {
      this.getscoreRed = scoreRingFollowCollumn;
    }
    if (scoreRingFollowLine > 0 && this.getscoreRed > scoreRingFollowLine) {
      this.getscoreRed = scoreRingFollowLine;
    }
    if (scorediagBlueFollowLine > 0 && this.getscoreRed > scorediagBlueFollowLine) {
      this.getscoreRed = scorediagBlueFollowLine;
    }
    if (this.getscoreRed < scoreColumnRed) {
      this.getscoreRed = scoreColumnRed;
    }
    if (this.getscoreRed < scoreLineRed) {
      this.getscoreRed = scoreLineRed;
    }
    if (this.getscoreRed < scorediagRed) {
      this.getscoreRed = scorediagRed;
    }
    if (this.getscoreRed <= scoreColumnBlue || this.getscoreRed <= scoreLineBlue || this.getscoreRed <= scorediagBlue) {
      this.getscoreRed = -1;

    }
    return this.getscoreRed;
  }

  convertToLine(): void {
    this.gridColumn.map((col, indexcol) => col.map((line, indexLine) => this.gridLine[indexLine][indexcol] = line));
  }

  isInGrid(column: number): boolean {
    return column <= this.COLUMN && this.numberRings(column) < this.LINE;
  }

  private addRing(column: number, player: Ring): void {
    if (this.isInGrid(column)) {
      this.gridColumn[column - 1].push(player);
    }
    this.convertToLine();
  }

  private IsFourRingFollowingInColumn(ring: Ring): boolean {
    return this.gridColumn.some(column => {
      return column.toString().includes([ring, ring, ring, ring].toString());
    });
  }

  private ScoreRingFollowingInColumn(ring: Ring): number {
    if (this.gridColumn.some(line => {
      return line.toString().includes([ring, ring, ring, ring].toString());
    })) {
      return 1;
    }
    if (this.gridColumn.some(line => {
      return line.slice(-3, line.length).toString().includes([ring, ring, ring].toString());
    })) {
      return FIRSTREWARD;
    }
    if (this.gridColumn.some(line => {
      return line.slice(-2, line.length).toString().includes([ring, ring].toString());
    })) {
      return SECONDREWARD;
    }
    if (this.gridColumn.some(line => {
      return line.slice(-1, line.length).toString().includes([ring].toString());
    })) {
      return THIRDREWARD;
    }
    return -1;
  }

  private ScoreRingFollowingInLinen(ring: Ring): number {
    if (this.gridLine.some(line => {
      return line.toString().includes([ring, ring, ring, ring].toString());
    })) {
      return 1;
    }

    if (this.gridLine.some(line => {
      return line.slice(-3, line.length).toString().includes([ring, ring, ring].toString());
    })) {
      return THIRDREWARD;
    }
    if (this.gridLine.some(line => {
      return line.slice(-2, line.length).toString().includes([ring, ring].toString());
    })) {
      return SECONDREWARD;
    }
    if (this.gridLine.some(line => {
      return line.slice(-1, line.length).toString().includes([ring].toString());
    })) {
      return LASTREWARD;
    }
    return -1;
  }

  private IsFourRingFollowingInLine(ring: Ring): boolean {
    return this.gridLine.some(line => {
      return line.toString().includes([ring, ring, ring, ring].toString());
    });
  }

  private IsFourRingFollowingDiagLeft(ring: Ring): boolean {
    for (let line = 0; line < 3; line++) {
      for (let column = 0; column < 4; column++) {

        if (this.gridColumn[column] !== undefined && this.gridColumn[column][line] === ring &&
          this.gridColumn[column + 1][line + 1] === ring &&
          this.gridColumn[column + 2][line + 2] === ring &&
          this.gridColumn[column + 3][line + 3] === ring
        ) {
          return true;
        }
      }
    }
    return false;
  }

  private IsFourRingFollowingDiagRight(ring: Ring): boolean {
    for (let line = 0; line < 3; line++) {
      for (let column = 3; column < this.COLUMN; column++) {

        if (this.gridColumn[column] !== undefined && this.gridColumn[column][line] === ring &&
          this.gridColumn[column - 1][line + 1] === ring &&
          this.gridColumn[column - 2][line + 2] === ring &&
          this.gridColumn[column - 3][line + 3] === ring
        ) {
          return true;
        }
      }
    }
    return false;
  }

  private ScoreRingFollowingInDiag(ring: Ring): number {
    for (let line = 0; line < 3; line++) {
      for (let column = 0; column < 4; column++) {

        if (this.gridColumn[column] !== undefined && this.gridColumn[column][line] === ring &&
          this.gridColumn[column + 1][line + 1] === ring &&
          this.gridColumn[column + 2][line + 2] === ring &&
          this.gridColumn[column + 3][line + 3] === ring
        ) {
          return FIRSTREWARD;
        }
      }
    }
    for (let line = 0; line < 3; line++) {
      for (let column = 0; column < 4; column++) {

        if (this.gridColumn[column] !== undefined && this.gridColumn[column][line] === ring &&
          this.gridColumn[column + 1][line + 1] === ring &&
          this.gridColumn[column + 2][line + 2] === ring

        ) {
          return SECONDREWARD;
        }
      }
    }
    for (let line = 0; line < 3; line++) {
      for (let column = 0; column < 4; column++) {

        if (this.gridColumn[column] !== undefined && this.gridColumn[column][line] === ring &&
          this.gridColumn[column + 1][line + 1] === ring


        ) {
          return THIRDREWARD;
        }
      }
    }
    for (let line = 0; line < 3; line++) {
      for (let column = 0; column < 4; column++) {

        if (this.gridColumn[column] !== undefined && this.gridColumn[column][line] === ring


        ) {
          return LASTREWARD;
        }
      }
    }
    return -1;
  }

  private ScoreRingFollowingCollumn(ring: Ring, ringAdverse: Ring): number {
    let result = -1;
    if (this.gridColumn.some(line => {
      return line.slice(-2, line.length).toString().includes([ringAdverse, ring].toString());
    })) {
      result = FIRSTREWARD;
    }

    return result;
  }
  private ScoreRingFollowingLine(ring: Ring, ringAdverse: Ring): number {
    let result = -1;
    if (this.gridLine.some(line => {
      return line.slice(-2, line.length).toString().includes([ringAdverse, ring].toString());
    })) {
      result = FIRSTREWARD;
    }

    return result;
  }

  private ScorediagFollowing(ring: Ring, ringAdverse: Ring): number {

    for (let line = 0; line < 3; line++) {
      for (let column = 0; column < 4; column++) {

        if (this.gridColumn[column] !== undefined && this.gridColumn[column][line] === ringAdverse &&
          this.gridColumn[column + 1][line + 1] === ring


        ) {
          return FIRSTREWARD;
        }
      }
    }

    return -1;
  }
}



