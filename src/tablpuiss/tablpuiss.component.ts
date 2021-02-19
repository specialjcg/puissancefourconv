import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Grid, Ring} from '../model/Puissance4';
import {HttpPuissanceRepository} from '../secondary/HttpPuissanceRepository';

@Component({
  selector: 'app-tablpuiss',
  templateUrl: './tablpuiss.component.html',
  styleUrls: ['./tablpuiss.component.css']
})
export class TablpuissComponent implements OnInit {
  grid: Grid;
  gridRedWin: Grid[];
  vainqueur: string;
  listGame: number[];
  proposition: any;
  data = [];
  listQ: { red: number; blue: number }[];
  displayedColumns = ['numberGame', 'blue', 'red'];
  dataSource: [{ red: number; numberGame: number; blue: number }];
  public datared: { red: number; numberGame: number; blue: number }[];
  lastscore: number;
  databar: number[];
  private alter: boolean;
  private redPass: boolean;
  private bluePass: boolean;
  private inc: number;
  private moyenne: number;

  constructor(private DQNService: HttpPuissanceRepository, private cdr: ChangeDetectorRef) {
    this.grid = new Grid();
  }

  ngOnInit(): void {
    this.lastscore = 0;
    this.moyenne = 0;
    this.inc = 0;
    this.alter = true;
    this.vainqueur = '';
    this.gridRedWin = [];
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
      this.grid.getscoreRed = this.grid.scoreRed();
      this.grid.getscoreBlue = this.grid.scoreBlue();
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
        this.grid.getscoreRed = this.grid.scoreRed();

        this.grid.getscoreBlue = this.grid.scoreBlue();

      });

    }
    this.cdr.detectChanges();
  }


  reset(): void {
    this.grid = new Grid();
    this.vainqueur = '';
    this.listGame = [];
    this.listQ = [];
    this.datared = [];
    this.inc = 0;
  }

  async gameIA(): Promise<void> {
    while (this.lastscore < 100) {
      this.proposition = 0;
      this.reset();
      for (let i = 0; i < 500; i++) {
        this.grid = new Grid();
        this.redPass = true;
        while ((this.grid.win() !== true || this.grid.full()) && this.redPass) {
          if (this.redPass && !this.grid.win()) {
            await this.DQNService.DqnRed(this.grid).toPromise().then((data) => {

                this.proposition = data;

                if (this.grid.isInGrid(this.proposition + 1)) {
                  this.grid.addRingPlayerRed(this.proposition + 1);
                  if (this.grid.win()) {
                    this.grid.getscoreRed = 1;
                    this.grid.getscoreBlue = -1;
                    this.listGame.push(1);
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
            await this.DQNService.DqnBlue(this.grid).toPromise().then((data) => {
                this.proposition = data;
                if (this.grid.isInGrid(this.proposition + 1)) {
                  this.grid.addRingPlayerBlue(this.proposition + 1);
                  if (this.grid.win()) {
                    this.grid.getscoreRed = -0.1;
                    this.grid.getscoreBlue = -0.1;
                    this.listGame.push(1);
                    this.gridRedWin.push(this.grid);
                  }
                  this.bluePass = true;
                } else {
                  this.bluePass = false;
                  this.listGame.push(2);
                  this.grid.getscoreRed = -0.1;
                  this.redPass = false;
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
      if (this.datared.reduce((memo, val) => memo + val.blue, 0) / this.datared.length > this.lastscore) {
        this.lastscore = this.datared.reduce((memo, val) => memo + val.blue, 0) / this.datared.length;
      }
    }
  }

  async gamelearnIA(): Promise<void> {
    while (this.lastscore < 100) {
      this.reset();
      let col = 0;
      for (let i = 0; i < 500; i++) {
        this.grid = new Grid();
        this.redPass = true;

        col = i % 7 + 1;
        // col = Math.trunc(Math.random() * 7) + 1;

        while ((this.grid.win() !== true || this.grid.full()) && this.redPass) {
          if (this.redPass && !this.grid.win() && this.grid.isInGrid(col)) {
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
            this.listGame.push(2);
            this.grid.getscoreRed = -0.1;
            this.redPass = false;
          }


          if (this.bluePass && !this.grid.win()) {
            await this.DQNService.DqnBlue(this.grid).toPromise().then((data) => {
                this.proposition = data;
                if (this.grid.isInGrid(this.proposition + 1)) {
                  this.grid.addRingPlayerBlue(this.proposition + 1);
                  if (this.grid.win()) {
                    this.grid.getscoreRed = -1;
                    this.grid.getscoreBlue = 1;
                    this.listGame.push(2);
                  }
                  this.redPass = true;
                } else {
                  this.redPass = false;
                  this.listGame.push(2);
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
      if (this.datared.reduce((memo, val) => memo + val.blue, 0) / this.datared.length > this.lastscore) {
        this.lastscore = this.datared.reduce((memo, val) => memo + val.blue, 0) / this.datared.length;

        await this.savebrain1();
        await this.loadbrain1();
      }
      await this.gameIATest();
    }
  }

  async gameIATest(): Promise<void> {
    let col = 0;
    await this.loadbrain1();
    this.reset();
    for (let i = 0; i < 500; i++) {
      this.grid = new Grid();
      this.redPass = true;
      col = i % 7 + 1;
     // col = Math.trunc(Math.random() * 7) + 1;

      while ((this.grid.win() !== true || this.grid.full()) && this.redPass) {

        if (this.redPass && !this.grid.win() && this.grid.isInGrid(col)) {
          this.grid.addRingPlayerRed(col);

          if (this.grid.win()) {
            this.grid.getscoreRed = 1;
            this.grid.getscoreBlue = -0.1;
            this.listGame.push(1);
            this.gridRedWin.push(this.grid);
          }
          this.bluePass = true;
        } else {
          this.bluePass = false;
          this.listGame.push(2);
          this.grid.getscoreRed = -0.1;
          this.redPass = false;
        }


        if (this.bluePass && !this.grid.win()) {
          await this.DQNService.ActionBlue(this.grid).toPromise().then((data) => {
              this.proposition = data;
              if (this.grid.isInGrid(this.proposition + 1)) {
                this.grid.addRingPlayerBlue(this.proposition + 1);
                if (this.grid.win()) {
                  this.grid.getscoreRed = -0.1;
                  this.grid.getscoreBlue = 1;
                  this.listGame.push(2);
                }
                this.redPass = true;
              } else {
                this.redPass = false;
                this.listGame.push(2);
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
    if ( this.databar.reduce((memo, val) => memo + val, 0) / this.databar.length > this.lastscore) {
      this.lastscore = this.databar.reduce((memo, val) => memo + val, 0) / this.databar.length;

    }


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

  allGridRedWin() {
    this.grid = this.gridRedWin[this.gridRedWin.length - 1 - this.inc];
    this.inc++;
  }
}


