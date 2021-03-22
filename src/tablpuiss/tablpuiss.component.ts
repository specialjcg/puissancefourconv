import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Grid, Ring} from '../model/Puissance4';
import {HttpPuissanceRepository} from '../secondary/HttpPuissanceRepository';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-tablpuiss',
  templateUrl: './tablpuiss.component.html',
  styleUrls: ['./tablpuiss.component.css']
})
export class TablpuissComponent implements OnInit {
  grid: Grid;
  gridRedWin: Grid[];
  gridBlueWin: Grid[];
  vainqueur: string;
  listGame: number[];
  proposition: any;
  data = [];
  listQ: { red: number; blue: number }[];
  displayedColumns: string[];
  dataSource: [{ red: number; numberGame: number; blue: number }];
  public datared: { red: number; numberGame: number; blue: number }[];
  lastscore: number;
  databar: number[];
  private alter: boolean;
  private redPass: boolean;
  private bluePass: boolean;
  private inc: number;
  private moyenne: number;


  constructor(private DQNService: HttpPuissanceRepository, private cdr: ChangeDetectorRef, private sanitizer: DomSanitizer) {
    this.dataSource = [{
      numberGame: 0,
      blue: 0,
      red: 0
    }];
    this.displayedColumns = ['numberGame', 'blue', 'red'];
    this.grid = new Grid();
    this.lastscore = 0;
    this.moyenne = 0;
    this.inc = 0;
    this.alter = true;
    this.vainqueur = '';
    this.gridRedWin = [];
    this.gridBlueWin = [];
    this.listGame = [];
    this.listQ = [];
    this.redPass = true;
    this.bluePass = true;
    this.datared = [];
    this.databar = [];
  }

  ngOnInit(): void {

    this.lastscore = 0;
    this.moyenne = 0;
    this.inc = 0;
    this.alter = true;
    this.vainqueur = '';
    this.gridRedWin = [];
    this.gridBlueWin = [];
    this.listGame = [];
    this.listQ = [];
    this.redPass = true;
    this.bluePass = true;
    this.datared = [];
    this.databar = [];
  }

  print(column: number, row: number): Ring {
    if (this.grid.gridColumn[column][row] !== undefined) {
      return this.grid.gridColumn[column][row];
    }
    return 0;
  }

  async game(column: number): Promise<void> {

    this.redPass = true;
    this.grid.addRingPlayerRed(column + 1);
    this.cdr.detectChanges();
    if (this.grid.win() && this.vainqueur === '') {
      this.vainqueur = 'Red Win';
      this.grid.getscoreRed = -0.1;
      this.grid.getscoreBlue = -0.1;
      this.cdr.detectChanges();
    } else {
      this.grid.getscoreRed = this.grid.rewardRed();
      this.grid.getscoreBlue = this.grid.rewardBlue();
    }
    while (this.redPass && !this.grid.win()) {
      await this.DQNService.ActionBlue(this.grid).toPromise().then((data) => {
        this.proposition = data;
        if (this.grid.isInGrid(this.proposition + 1)) {
          this.grid.addRingPlayerBlue(this.proposition + 1);
          if (this.grid.win() && this.vainqueur === '') {
            this.vainqueur = 'blue Win';
            this.grid.getscoreRed = -0.1;
            this.grid.getscoreBlue = -0.1;
            this.cdr.detectChanges();
          }
          this.redPass = false;
          this.grid.getscoreBlue = -1;
        } else {
          this.redPass = true;
        }
        this.grid.getscoreRed = this.grid.rewardRed();
        this.grid.getscoreBlue = this.grid.rewardBlue();

      });

    }
    this.cdr.detectChanges();
  }

  async gameManuel(column: number): Promise<void> {

    if (this.redPass) {
      this.redPass = false;

      this.grid.addRingPlayerRed(column + 1);
      this.cdr.detectChanges();
      if (this.grid.win() && this.vainqueur === '') {
        this.vainqueur = 'Red Win';

      }
    } else {
      this.redPass = true;
      this.grid.addRingPlayerBlue(column + 1);
      this.cdr.detectChanges();
      if (this.grid.win() && this.vainqueur === '') {
        this.vainqueur = 'blue Win';


      }


    }
    this.grid.getscoreRed = this.grid.rewardRed();
    this.grid.getscoreBlue = this.grid.rewardBlue();
    this.cdr.detectChanges();
  }


  reset(): void {
    this.grid = new Grid();
    this.moyenne = 0;
    this.inc = 0;
    this.alter = true;
    this.vainqueur = '';
    this.gridRedWin = [];
    this.gridBlueWin = [];
    this.listGame = [];
    this.listQ = [];
    this.redPass = true;
    this.bluePass = true;
    this.datared = [];
  }

  async gameIA(): Promise<void> {
    while (this.lastscore < 100) {
      this.proposition = 0;
      this.reset();
      for (let i = 0; i < 800; i++) {
        this.grid = new Grid();
        this.redPass = true;
        while ((this.grid.win() !== true && !this.grid.full())) {
          if (this.redPass && !this.grid.win()) {
            await this.DQNService.DqnRed(this.grid).toPromise().then(async (data) => {

                this.proposition = data;

                if (this.grid.isInGrid(this.proposition + 1)) {
                  this.grid.addRingPlayerRed(this.proposition + 1);
                  if (this.grid.win()) {
                    this.grid.getscoreRed = 1;
                    this.grid.getscoreBlue = -1;
                    this.listGame.push(1);
                    this.gridBlueWin.push(this.grid);
                    await this.DQNService.DqnBlue(this.grid).toPromise().then(() => {
                      this.cdr.detectChanges();
                    });
                  }
                  this.bluePass = true;
                } else {
                  this.bluePass = false;
                  this.grid.getscoreRed = -1;
                }
              }
            );
          }
          if (this.bluePass && !this.grid.win()) {
            await this.DQNService.DqnBlue(this.grid).toPromise().then(async (data) => {
                this.proposition = data;
                if (this.grid.isInGrid(this.proposition + 1)) {
                  this.grid.addRingPlayerBlue(this.proposition + 1);
                  if (this.grid.win()) {
                    this.grid.getscoreRed = -1;
                    this.grid.getscoreBlue = 1;
                    this.listGame.push(2);
                    this.gridRedWin.push(this.grid);
                    await this.DQNService.DqnRed(this.grid).toPromise().then(() => {
                      this.cdr.detectChanges();
                    });
                  }
                  this.bluePass = true;
                } else {
                  this.redPass = false;
                  this.bluePass = true;
                  this.grid.getscoreBlue = -1;
                }
              }
            );
          }
          this.grid.getscoreRed = this.grid.rewardRed();
          this.grid.getscoreBlue = this.grid.rewardBlue();
        }
        const redwin = this.listGame.filter(value => value === 1).length / this.listGame.length * 100;
        const bluewin = this.listGame.filter(value => value === 2).length / this.listGame.length * 100;
        this.listQ.push({red: redwin, blue: bluewin});
        this.cdr.detectChanges();

        this.dataSource = [{
          numberGame: this.listQ.length,
          blue: this.moyenneblue(this.listQ),
          red: this.moyennered(this.listQ)
        }];
        this.datared = [...this.datared, {
          numberGame: this.listQ.length,
          blue: this.moyenneblue(this.listQ),
          red: this.moyennered(this.listQ)
        }];

      }
      this.databar = [...this.databar, this.datared.reduce((memo, val) => memo + val.blue, 0) / this.datared.length];
      if (this.datared.reduce((memo, val) => memo + val.blue, 0) / this.datared.length > this.lastscore) {
        this.lastscore = this.datared.reduce((memo, val) => memo + val.blue, 0) / this.datared.length;
      }
    }
  }

  async gamelearnIA(): Promise<void> {
    while (this.lastscore < 100) {
      this.reset();
      for (let i = 0; i < 200; i++) {
        this.grid = new Grid();
        this.redPass = true;
        /* if (i % 2 === 0) {
           col = Math.trunc(Math.random() * 7) + 1;
         } else {
           col = Math.trunc(Math.random() * 7) + 1;
         }*/
        while ((this.grid.win() !== true && !this.grid.full())) {
          let col = this.littleia(this.grid);

          /* if (i % 4 === 0) {
             col = Math.trunc(Math.random() * 7) + 1;
           } else if (i % 2 === 0) {
             col = (col + 1) % 7 + 1;
           }*/
          if (this.redPass && !this.grid.win()) {
            if (this.grid.isInGrid(col)) {
              this.grid.addRingPlayerRed(col);

              if (this.grid.win()) {
                this.grid.getscoreRed = 1;
                this.grid.getscoreBlue = -1;
                this.listGame.push(1);
                this.gridRedWin.push(this.grid);
                await this.DQNService.DqnBlue(this.grid).toPromise().then(() => {

                  }
                );
                this.redPass = false;

              }
              this.bluePass = true;
            } else {
              this.bluePass = false;
              col = Math.trunc(Math.random() * 7) + 1;
              this.grid.getscoreRed = -1;
            }
          }


          if (this.bluePass && !this.grid.win()) {
            await this.DQNService.DqnBlue(this.grid).toPromise().then(async (data) => {
                this.proposition = data;
                if (this.grid.isInGrid(this.proposition + 1)) {
                  this.grid.addRingPlayerBlue(this.proposition + 1);
                  if (this.grid.win()) {
                    this.grid.getscoreRed = -1;
                    this.grid.getscoreBlue = 1;
                    await this.DQNService.DqnBlue(this.grid).toPromise().then(() => {

                    });
                    this.listGame.push(2);
                    this.gridBlueWin.push(this.grid);


                    this.bluePass = false;
                  }
                  this.redPass = true;
                } else {
                  this.redPass = false;
                  this.bluePass = true;
                  this.grid.getscoreBlue = -1;
                }
              }
            );
          }
          this.grid.getscoreRed = this.grid.rewardRed();
          this.grid.getscoreBlue = this.grid.rewardBlue();
        }
        const redwin = this.listGame.filter(value => value === 1).length / this.listGame.length * 100;
        const bluewin = this.listGame.filter(value => value === 2).length / this.listGame.length * 100;
        this.listQ.push({red: redwin, blue: bluewin});

        this.dataSource = [{
          numberGame: this.listQ.length,
          blue: this.moyenneblue(this.listQ),
          red: this.moyennered(this.listQ)
        }];
        this.datared = [...this.datared, {
          numberGame: this.listQ.length,
          blue: this.moyenneblue(this.listQ),
          red: this.moyennered(this.listQ)
        }];
        this.cdr.detectChanges();


      }
      if (this.datared.reduce((memo, val) => memo + val.blue, 0) / this.datared.length > this.lastscore) {
        this.lastscore = this.datared.reduce((memo, val) => memo + val.blue, 0) / this.datared.length;

        await this.savebrain1();
        await this.loadbrain1();
      }
      this.databar = [...this.databar, this.datared.reduce((memo, val) => memo + val.blue, 0) / this.datared.length];
      await this.DQNService.learn().toPromise().then(() => {
        this.cdr.detectChanges();
      });    }

  }

  async gameIATest(): Promise<void> {
    this.reset();
    for (let i = 0; i < 200; i++) {
      this.grid = new Grid();
      this.redPass = true;


      while ((this.grid.win() !== true && !this.grid.full()) ) {
        const col = Math.trunc(Math.random() * 7) + 1;
        if (this.redPass && !this.grid.win()) {
          if (this.grid.isInGrid(col)) {
            this.grid.addRingPlayerRed(col);

            if (this.grid.win()) {
              this.grid.getscoreRed = 1;
              this.grid.getscoreBlue = -1;
              this.listGame.push(1);
              this.gridRedWin.push(this.grid);

            }
            this.bluePass = true;
          } else {
            this.bluePass = false;
            this.grid.getscoreRed = -0.1;
          }
        }


        if (this.bluePass && !this.grid.win()) {
          await this.DQNService.ActionBlue(this.grid).toPromise().then((data1) => {
              this.proposition = data1;
              if (this.grid.isInGrid(this.proposition + 1)) {
                this.grid.addRingPlayerBlue(this.proposition + 1);
                if (this.grid.win()) {
                  this.grid.getscoreRed = -0.1;
                  this.grid.getscoreBlue = 1;
                  this.listGame.push(2);
                  this.gridBlueWin.push(this.grid);

                }
                this.redPass = true;
              } else {
                this.redPass = false;
                this.bluePass = true;
                this.grid.getscoreBlue = -0.1;
              }
            }
          );
        }
        this.grid.getscoreRed = this.grid.scoreRed();
        this.grid.getscoreBlue = this.grid.scoreBlue();
      }
      const redwin = this.listGame.filter(value => value === 1).length / this.listGame.length * 100;
      const bluewin = this.listGame.filter(value => value === 2).length / this.listGame.length * 100;
      this.listQ.push({red: redwin, blue: bluewin});
      this.cdr.detectChanges();

      this.dataSource = [{
        numberGame: this.listQ.length,
        blue: this.moyenneblue(this.listQ),
        red: this.moyennered(this.listQ)
      }];
      this.datared = [...this.datared, {
        numberGame: this.listQ.length,
        blue: this.moyenneblue(this.listQ),
        red: this.moyennered(this.listQ)
      }];


    }
    this.databar = [...this.databar, this.datared.reduce((memo, val) => memo + val.blue, 0) / this.datared.length];
    const data = {red: this.gridRedWin, blue: this.gridBlueWin};
    const blobfurniture = new Blob([JSON.stringify(data)], {type: 'application/json'});

    const url = URL.createObjectURL(blobfurniture);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const date: Date = new Date();
    link.setAttribute('download', 'data' + date + '.json');
    const event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
    link.dispatchEvent(event);

  }

  moyennered(listQ: { red: number; blue: number }[]): number {
    if (listQ.length > 10) {
      return listQ.slice(-10, this.listQ.length).reduce((acc, val) => val.red + acc, 0) / 10;
    }
    return 100;
  }

  moyenneblue(listQ: { red: number; blue: number }[]): number {
    if (listQ.length > 10) {
      return listQ.slice(-10, this.listQ.length).reduce((acc, val) => val.blue + acc, 0) / 10;
    }
    return 100;
  }

  savebrain1(): void {
    this.DQNService.savebrain1().subscribe(data => console.log(JSON.stringify(data)));
  }

  savebrain2(): void {
    this.DQNService.savebrain2().subscribe(data => console.log(JSON.stringify(data)));
  }

  loadbrain2(): void {
    this.DQNService.loadbrain2().subscribe(data => console.log(JSON.stringify(data)));
  }

  loadbrain1(): void {
    this.DQNService.loadbrain1().subscribe(data => console.log(JSON.stringify(data)));
  }

  learn(): void {
    this.DQNService.learn().subscribe();
  }

  allGridRedWin(): void {
    this.grid = this.gridRedWin[this.gridRedWin.length - 1 - this.inc];
    this.inc++;
  }
  private littleia(grid: Grid): number {
    let col = 1;
    let bestcol = 0;

    for (const column of this.grid.gridColumn) {
      if (column.length < 6) {
        if (column.slice(-1, column.length).toString().includes([Ring.RED].toString())) {
          bestcol = col;
        }
        col++;
      }
    }
    col = 1;
    for (const column of this.grid.gridColumn) {
      if (column.length < 6) {
        if (column.slice(-2, column.length).toString().includes([Ring.RED, Ring.RED].toString())) {
          bestcol = col;
        }
        col++;
      }
    }
    col = 1;
    for (const column of this.grid.gridColumn) {
      if (column.length < 6) {
        if (column.slice(-3, column.length).toString().includes([Ring.RED, Ring.RED, Ring.RED].toString())) {
          bestcol = col;
        }
        col++;
      }
    }
    if (bestcol === 0 || !this.grid.isInGrid(bestcol) ) {
      bestcol = Math.trunc(Math.random() * 7) + 1;
    }
    return bestcol;
  }
}


