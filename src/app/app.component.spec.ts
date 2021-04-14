import {async, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {Grid, LASTREWARD, Ring, SECONDREWARD, THIRDREWARD} from '../model/Puissance4';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';


describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ], schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'mentoringhexa'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('mentoringhexa');
  });


});
describe('test puissant four', () => {
  let grid: Grid;
  beforeEach(() => {
    grid = new Grid();
  });


  it('should grid  be empty in first', () => {


    expect(grid.empty()).toBeTruthy();
  });
  it('should grid  not empty when add 1 ring', () => {

    grid.addRingPlayerRed(1);
    expect(grid.empty()).toBeFalsy();
  });
  it('should have two ring after add two ring', () => {

    grid.addRingPlayerRed(1);
    grid.addRingPlayerRed(1);
    expect(grid.numberRings(1)).toEqual(2);
  });
  it('should not  adding  ring beyond the maximum size of the grid', () => {

    grid.addRingPlayerRed(1);
    grid.addRingPlayerRed(1);
    grid.addRingPlayerRed(1);
    grid.addRingPlayerRed(1);
    grid.addRingPlayerRed(1);
    grid.addRingPlayerRed(1);
    grid.addRingPlayerRed(1);
    expect(grid.numberRings(1)).toEqual(6);
  });
  it('should  adding  in a second column', () => {

    grid.addRingPlayerRed(2);
    expect(grid.numberRings(2)).toEqual(1);
  });
  it('should not  adding  ring beyond the maximum size of the grid in the second column', () => {

    grid.addRingPlayerRed(2);
    grid.addRingPlayerRed(2);
    grid.addRingPlayerRed(2);
    grid.addRingPlayerBlue(2);
    grid.addRingPlayerRed(2);
    grid.addRingPlayerRed(2);
    grid.addRingPlayerRed(2);
    expect(grid.numberRings(2)).toEqual(6);
    grid.scoreBlue();

    expect(grid.scoreRed()).toEqual(LASTREWARD);
  });
  it('should  not adding  ring beyond the maximun of the grid in width', () => {


    expect(() => grid.addRingPlayerRed(8)).toThrow();
  });
  it('should  not adding  ring beyond the maximun of the grid and return throw error', () => {


    expect(() => grid.addRingPlayerRed(8)).toThrow();
  });
  it('should add Ring Red for gamer 1', () => {

    grid.addRingPlayerRed(1);
    expect(grid.numberRings(1)).toEqual(1);
    expect(grid.getRing(1, 1)).toEqual(Ring.RED);
  });
  it('should add Ring Blue for gamer 2', () => {

    grid.addRingPlayerBlue(1);
    expect(grid.numberRings(1)).toEqual(1);
    expect(grid.getRing(1, 1)).toEqual(Ring.BLUE);
  });
  it('should win when with have 4 Ring BLUE in suite', () => {


    grid.addRingPlayerBlue(1);
    grid.addRingPlayerBlue(1);
    grid.addRingPlayerBlue(1);
    grid.addRingPlayerBlue(1);

    expect(grid.win()).toBeTruthy();
  });

  it('should convert Column to Line', () => {


    grid.addRingPlayerBlue(1);
    grid.addRingPlayerBlue(2);
    grid.addRingPlayerBlue(3);
    grid.addRingPlayerBlue(4);
    expect(grid.win()).toBeTruthy();
  });

  it('should give score to 1  when with have 4 Ring BLUE in suite', () => {


    grid.addRingPlayerBlue(1);
    grid.addRingPlayerBlue(1);
    grid.addRingPlayerBlue(1);
    grid.addRingPlayerBlue(1);
    expect(grid.scoreBlue()).toEqual(1);
  });
  it('should give score to 3/4  when with have 3 Ring BLUE in suite', () => {


    grid.addRingPlayerBlue(1);
    grid.addRingPlayerBlue(1);
    grid.addRingPlayerBlue(1);
    grid.addRingPlayerRed(1);
    grid.addRingPlayerBlue(1);
    expect(grid.scoreRed()).toEqual(LASTREWARD);
    expect(grid.scoreBlue()).toEqual(LASTREWARD);
  });
  it('should give score to 3/4  when with have 3 Ring BLUE in suite in two column', () => {


    grid.addRingPlayerBlue(1);
    grid.addRingPlayerBlue(1);
    grid.addRingPlayerBlue(1);
    grid.addRingPlayerRed(1);
    grid.addRingPlayerBlue(1);
    grid.addRingPlayerBlue(2);
    grid.addRingPlayerBlue(2);
    grid.addRingPlayerBlue(2);
    grid.addRingPlayerRed(2);
    grid.addRingPlayerBlue(2);
    expect(grid.scoreBlue()).toEqual(THIRDREWARD);
  });
  it('should give score to 1  when with have 4 Ring RED in suite', () => {


    grid.addRingPlayerRed(2);
    grid.addRingPlayerRed(3);
    grid.addRingPlayerRed(4);
    grid.addRingPlayerRed(5);
    grid.addRingPlayerRed(6);
    grid.addRingPlayerBlue(2);
    grid.addRingPlayerBlue(3);
    grid.addRingPlayerBlue(4);
    grid.addRingPlayerBlue(5);
    grid.addRingPlayerBlue(6);
    grid.addRingPlayerRed(2);
    grid.addRingPlayerRed(3);
    grid.addRingPlayerRed(4);
    grid.addRingPlayerRed(5);
    grid.addRingPlayerRed(6);
    grid.addRingPlayerBlue(2);
    grid.addRingPlayerBlue(3);
    grid.addRingPlayerBlue(4);
    grid.addRingPlayerBlue(5);
    grid.addRingPlayerBlue(6);
    expect(grid.gridDiagLeft[0]).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    expect(grid.gridDiagRight[0]).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    expect(grid.gridDiagLeft[1]).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    expect(grid.gridDiagRight[1]).toEqual([0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  });
  it('should give score to 1  when with have 4 Ring RED in suite in line', () => {


    grid.addRingPlayerRed(2);
    grid.addRingPlayerBlue(6);
    grid.addRingPlayerRed(3);
    grid.addRingPlayerBlue(6);
    grid.addRingPlayerRed(4);
    grid.addRingPlayerBlue(6);
    grid.addRingPlayerRed(5);

    expect(grid.win()).toBeTruthy();
  });
  it('should give score to 3/4  when with have 3 Ring RED in suite', () => {


    grid.addRingPlayerRed(1);
    grid.addRingPlayerRed(1);
    grid.addRingPlayerRed(1);
    grid.addRingPlayerBlue(1);
    grid.addRingPlayerRed(1);
    expect(grid.scoreRed()).toEqual(LASTREWARD);
  });
  it('should give score to 3/4  when with have 3 Ring RED in suite in two column', () => {


    grid.addRingPlayerRed(1);
    grid.addRingPlayerRed(1);
    grid.addRingPlayerRed(1);
    grid.addRingPlayerBlue(1);
    grid.addRingPlayerRed(2);
    grid.addRingPlayerRed(2);
    grid.addRingPlayerBlue(2);
    grid.addRingPlayerRed(2);
    expect(grid.scoreRed()).toEqual(THIRDREWARD);
  });
  it('should give score to 3/4  when with have 2 Ring RED in diag and yellow defend', () => {


    grid.addRingPlayerRed(1);
    grid.addRingPlayerRed(2);
    grid.addRingPlayerRed(3);
    grid.addRingPlayerRed(1);
    grid.addRingPlayerRed(2);
    grid.addRingPlayerBlue(1);
    expect(grid.scoreBlue()).toEqual(LASTREWARD);
  });
  it('should give score to 1/4  when with have 1 Ring RED and one Blue in one and  two column', () => {


    grid.addRingPlayerRed(1);
    grid.addRingPlayerBlue(2);
    expect(grid.scoreRed()).toEqual(LASTREWARD);
  });
  it('should give score to 1  when with have 4 Ring RED in suite in two column', () => {


    grid.addRingPlayerRed(1);
    grid.addRingPlayerRed(1);
    grid.addRingPlayerRed(1);
    grid.addRingPlayerBlue(1);
    grid.addRingPlayerRed(2);
    grid.addRingPlayerRed(2);
    grid.addRingPlayerRed(2);
    grid.addRingPlayerRed(2);
    expect(grid.scoreRed()).toEqual(1);

  });

  it('should not win when with have 4 Ring BLUE in suite with one Red between', () => {


    grid.addRingPlayerBlue(1);
    grid.addRingPlayerBlue(1);
    grid.addRingPlayerBlue(1);
    grid.addRingPlayerRed(1);
    grid.addRingPlayerBlue(1);

    expect(grid.win()).toBeFalsy();
  });
  it('should win when with have 4 Ring RED in suite', () => {

    grid.addRingPlayerRed(1);
    grid.addRingPlayerRed(1);
    grid.addRingPlayerRed(1);
    grid.addRingPlayerRed(1);

    expect(grid.win()).toBeTruthy();
  });
  it('should not win when with have 4 Ring Red in suite with one blue between', () => {

    grid.addRingPlayerRed(1);
    grid.addRingPlayerRed(1);
    grid.addRingPlayerRed(1);
    grid.addRingPlayerBlue(1);
    grid.addRingPlayerRed(1);

    expect(grid.win()).toBeFalsy();
  });
  it('should win when with have 4 Ring following RED in line ', () => {

    grid.addRingPlayerRed(2);
    grid.addRingPlayerRed(3);
    grid.addRingPlayerRed(4);
    grid.addRingPlayerRed(5);

    expect(grid.win()).toBeTruthy();
  });
  it('should not win when with have 4 Ring Red in line in suite with one blue between', () => {

    grid.addRingPlayerRed(1);
    grid.addRingPlayerRed(2);
    grid.addRingPlayerRed(3);
    grid.addRingPlayerBlue(4);
    grid.addRingPlayerRed(5);

    expect(grid.win()).toBeFalsy();
  });
  it('should  win in line test', () => {

    grid.addRingPlayerRed(1);
    grid.addRingPlayerRed(2);
    grid.addRingPlayerRed(3);
    grid.addRingPlayerBlue(4);
    grid.addRingPlayerRed(5);
    grid.addRingPlayerRed(6);
    grid.addRingPlayerRed(7);
    grid.addRingPlayerRed(3);
    grid.addRingPlayerRed(4);
    grid.addRingPlayerRed(5);
    grid.addRingPlayerRed(6);

    expect(grid.win()).toBeTruthy();
  });
  it('should  win in diag test right', () => {

    grid.addRingPlayerRed(1);
    grid.addRingPlayerRed(2);
    grid.addRingPlayerBlue(3);
    grid.addRingPlayerRed(4);
    grid.addRingPlayerRed(1);
    grid.addRingPlayerRed(2);
    grid.addRingPlayerRed(3);
    grid.addRingPlayerBlue(1);
    grid.addRingPlayerRed(2);
    expect(grid.win()).toBeFalsy();
    grid.addRingPlayerRed(1);

    expect(grid.win()).toBeTruthy();
  });
  it('should  win in diag test left', () => {

    grid.addRingPlayerRed(1);
    grid.addRingPlayerRed(2);
    grid.addRingPlayerRed(3);
    grid.addRingPlayerBlue(4);

    grid.addRingPlayerRed(2);
    grid.addRingPlayerRed(3);
    grid.addRingPlayerBlue(4);

    grid.addRingPlayerRed(3);
    grid.addRingPlayerRed(4);
    expect(grid.win()).toBeFalsy();
    grid.addRingPlayerRed(4);
    expect(grid.win()).toBeTruthy();
  });
  it('should have the good  diag  left', () => {

    grid.addRingPlayerRed(1);
    grid.addRingPlayerRed(1);
    grid.addRingPlayerRed(1);
    grid.addRingPlayerRed(1);
    grid.addRingPlayerRed(1);
    grid.addRingPlayerRed(4);
    grid.addRingPlayerRed(4);
    grid.addRingPlayerRed(4);
    grid.addRingPlayerRed(4);
    grid.addRingPlayerRed(4);
    grid.addRingPlayerRed(4);

    expect(grid.gridDiagRight[4].slice(0, 5)).toEqual([1, 0, 0, 1, 0]);
  });
  it('should have the good  diag  right', () => {

    grid.addRingPlayerRed(4);
    grid.addRingPlayerRed(4);
    grid.addRingPlayerRed(4);
    grid.addRingPlayerRed(4);
    grid.addRingPlayerRed(1);


    expect(grid.gridDiagLeft[7].slice(0, 4)).toEqual([1, 0, 0, 1]);
  });
  it('should  score  in diag test left', () => {

    grid.addRingPlayerRed(1);
    grid.addRingPlayerRed(2);
    grid.addRingPlayerRed(3);
    grid.addRingPlayerBlue(4);

    grid.addRingPlayerRed(2);
    grid.addRingPlayerRed(3);
    grid.addRingPlayerBlue(4);

    grid.addRingPlayerRed(3);
    grid.addRingPlayerRed(4);

    expect(grid.scoreRed()).toEqual(SECONDREWARD);
  });
  it('should  grid is not full of ring ', () => {

    for (let i = 1; i <= 5; i++) {
      grid.addRingPlayerRed(1);
      grid.addRingPlayerBlue(2);
      grid.addRingPlayerRed(3);
      grid.addRingPlayerBlue(4);
      grid.addRingPlayerBlue(5);
      grid.addRingPlayerRed(6);
      grid.addRingPlayerRed(7);
    }
    grid.addRingPlayerRed(1);
    grid.addRingPlayerBlue(2);
    grid.addRingPlayerRed(3);
    grid.addRingPlayerBlue(4);
    grid.addRingPlayerBlue(5);
    grid.addRingPlayerRed(6);
    expect(grid.full()).toBeFalsy();
  });
  it('should  grid is full of ring ', () => {
    for (let i = 1; i <= 6; i++) {
      grid.addRingPlayerRed(1);
      grid.addRingPlayerBlue(2);
      grid.addRingPlayerRed(3);
      grid.addRingPlayerBlue(4);
      grid.addRingPlayerBlue(5);
      grid.addRingPlayerRed(6);
      grid.addRingPlayerRed(7);
    }

    expect(grid.full()).toBeTruthy();
  });
  it('should  score grid to FirstReward ', () => {
    grid.addRingPlayerRed(1);
    grid.addRingPlayerBlue(1);
    grid.addRingPlayerBlue(1);
    grid.addRingPlayerBlue(1);
    grid.addRingPlayerRed(2);
    grid.addRingPlayerRed(2);
    grid.addRingPlayerRed(2);
    grid.addRingPlayerBlue(2);
    grid.addRingPlayerRed(3);
    grid.addRingPlayerRed(3);
    expect(grid.IsLastRingInLine(Ring.RED, Ring.BLUE)).toBeFalsy();
    expect(grid.scoreRed()).toEqual(SECONDREWARD);
    expect(grid.scoreBlue()).toEqual(0.9);
    grid.getscoreBlue = grid.rewardBlue();
    grid.getscoreRed = grid.rewardRed();
    expect(grid.getscoreBlue).toEqual(0.9);
    expect(grid.getscoreRed).toEqual(-SECONDREWARD);
  });
  it('should  score grid to when line not complete', () => {
    grid.addRingPlayerRed(1);
    grid.addRingPlayerBlue(2);
    grid.addRingPlayerBlue(3);
    grid.addRingPlayerBlue(5);
    grid.addRingPlayerRed(6);
    expect(grid.gridLine[0]).toEqual([1, 2, 2, 0, 2, 1, 0]);
    expect(grid.scoreRed()).toEqual(LASTREWARD);
    expect(grid.scoreBlue()).toEqual(SECONDREWARD);
    expect(grid.IsThreeRingInLine(Ring.BLUE)).toEqual(true);
    grid.getscoreBlue = grid.rewardBlue();
    grid.getscoreRed = grid.rewardRed();
    expect(grid.getscoreBlue).toEqual(0.7);
    expect(grid.getscoreRed).toEqual(LASTREWARD);
  });
  it('should  score grid to  column not complete', () => {
    grid.addRingPlayerRed(1);
    grid.addRingPlayerBlue(2);
    grid.addRingPlayerBlue(2);
    grid.addRingPlayerBlue(2);
    grid.addRingPlayerRed(6);
    grid.getscoreBlue = grid.rewardBlue();
    grid.getscoreRed = grid.rewardRed();
    expect(grid.getscoreBlue).toEqual(0.7);
    expect(grid.getscoreRed).toEqual(LASTREWARD);

  });
  it('should  score grid blue < red to  column not complete', () => {
    grid.addRingPlayerBlue(2);
    grid.addRingPlayerRed(3);
    grid.addRingPlayerRed(3);
    grid.addRingPlayerRed(3);
    grid.addRingPlayerBlue(4);
    grid.getscoreBlue = grid.rewardBlue();
    grid.getscoreRed = grid.rewardRed();
    expect(grid.getscoreBlue).toEqual(LASTREWARD);
    expect(grid.getscoreRed).toEqual(SECONDREWARD);

  });
  it('should  score grid red for 4 red', () => {
    grid.addRingPlayerRed(2);
    grid.addRingPlayerRed(2);
    grid.addRingPlayerRed(2);
    grid.addRingPlayerRed(2);
    expect(grid.scoreRed()).toEqual(1);

  });
  it('should  score grid red for 3 red', () => {

    grid.addRingPlayerRed(2);
    grid.addRingPlayerRed(2);
    grid.addRingPlayerRed(2);
    expect(grid.scoreRed()).toEqual(.7);

  });
  it('should  score grid red for 3 red an blue', () => {
    grid.addRingPlayerBlue(2);
    grid.addRingPlayerBlue(2);
    grid.addRingPlayerBlue(2);
    grid.addRingPlayerRed(2);
    grid.addRingPlayerRed(2);
    grid.addRingPlayerRed(2);

    expect(grid.scoreRed()).toEqual(LASTREWARD);

  });
  it('should  score grid red for 2 red', () => {
    grid.addRingPlayerRed(2);
    grid.addRingPlayerRed(2);
    expect(grid.scoreRed()).toEqual(.5);

  });
  it('should  score grid red for 1 red', () => {
    grid.addRingPlayerRed(2);
    expect(grid.scoreRed()).toEqual(LASTREWARD);

  });
  it('should  score grid red for 1 red in line ', () => {
    grid.addRingPlayerRed(1);
    grid.addRingPlayerRed(2);
    grid.addRingPlayerRed(3);
    grid.addRingPlayerBlue(4);

    expect(grid.scoreRed()).toEqual(LASTREWARD);
    expect(grid.scoreBlue()).toEqual(.9);

  });
  it('should  score grid red for 2blue in line ', () => {
    grid.addRingPlayerBlue(1);
    grid.addRingPlayerRed(2);
    grid.addRingPlayerRed(3);
    grid.addRingPlayerRed(4);
    grid.addRingPlayerBlue(5);

    expect(grid.IsLastRingInLine(Ring.BLUE, Ring.RED)).toBeTruthy();
    expect(grid.scoreRed()).toEqual(LASTREWARD);
    expect(grid.scoreBlue()).toEqual(.9);

  });
  it('should  score grid red for 3 blue in line ', () => {
    grid.addRingPlayerBlue(5);
    grid.addRingPlayerBlue(6);
    expect(grid.scoreBlue()).toEqual(0.5);
    grid.addRingPlayerBlue(1);
    grid.addRingPlayerRed(2);
    grid.addRingPlayerRed(3);
    grid.addRingPlayerRed(4);

    expect(grid.IsLastRingInLine(Ring.BLUE, Ring.RED)).toBeFalsy();

    expect(grid.scoreRed()).toEqual(LASTREWARD);
    expect(grid.scoreBlue()).toEqual(LASTREWARD);

  });
});
