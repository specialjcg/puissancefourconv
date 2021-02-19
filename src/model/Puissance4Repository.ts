import {Grid} from './Puissance4';
import {Observable} from 'rxjs';

export interface Puissance4Repository {
  DqnRed(grid: Grid): Observable<number>;
  DqnBlue(grid: Grid): Observable<number>;
  ActionBlue(grid: Grid): Observable<number>;
  savebrain1(): Observable<string> ;
  savebrain2(): Observable<string> ;
  loadbrain2(): Observable<string>;
  loadbrain1(): Observable<string>;

  get(): Promise<number>;
}
