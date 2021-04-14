import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Puissance4Repository} from '../model/Puissance4Repository';
import {COLUMN, Grid} from '../model/Puissance4';
import {Observable} from 'rxjs';

const toAction = (data: number) => data;

const toGrid = (data: COLUMN[]): COLUMN[] => data;

@Injectable({
  providedIn: 'root'
})
export class HttpPuissanceRepository implements Puissance4Repository {
  private data: any;

  constructor(private http: HttpClient) {
    this.data = [];
  }

  get(): Promise<number> {
    return this.http.get<number>('http://127.0.0.1:5002/action').toPromise().then(data => toAction(data));
  }


  DqnBlue(grid: Grid): Observable<number> {
    return this.http.put<number>('http://127.0.0.1:5002/blue', grid);
  }

  ActionBlue(grid: Grid): Observable<number> {
    return this.http.put<number>('http://127.0.0.1:5002/actionblue', grid);
  }

  DqnRed(grid: Grid): Observable<number> {
    return this.http.put<number>('http://127.0.0.1:5002/red', grid);
  }

  savebrain1(): Promise<any> {
    return this.http.get('http://127.0.0.1:5002/savebrain1').toPromise().then(data => console.log(JSON.stringify(data)));
  }

  savebrain2(): Observable<string> {
    return this.http.get<string>('http://127.0.0.1:5002/savebrain2');
  }

  loadbrain2(): Observable<string> {
    return this.http.get<string>('http://127.0.0.1:5002/loadbrain2');
  }

  loadbrain1(): Promise<any> {
    return this.http.get('http://127.0.0.1:5002/loadbrain1').toPromise();
  }

  learn(): Promise<string>{
    return this.http.get<string>('http://127.0.0.1:5002/learn').toPromise();
  }


  local(): Promise<COLUMN[]> {
    return this.http.get<COLUMN[]>('http://127.0.0.1:5002/local').toPromise().then(data => toGrid(data));
  }
  localtime(): Promise<COLUMN[]> {
    return this.http.get<COLUMN[]>('http://127.0.0.1:5002/localtime').toPromise().then(data => toGrid(data));
  }

}
