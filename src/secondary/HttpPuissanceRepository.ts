import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Puissance4Repository} from '../model/Puissance4Repository';
import {Grid} from '../model/Puissance4';
import {Observable} from 'rxjs';

const toAction = (data: number) => data;
@Injectable({
  providedIn: 'root'
})
export class HttpPuissanceRepository implements Puissance4Repository {
  private data: any;

  constructor(private http: HttpClient) {
    this.data = [];
  }

  get(): Promise<number> {
    return this.http.get<number>('http://127.0.0.1:5000/action').toPromise().then(data => toAction(data));
  }


  DqnBlue(grid: Grid): Observable<number> {
    return this.http.put<number>('http://127.0.0.1:5000/blue', grid);
  }
  ActionBlue(grid: Grid): Observable<number> {
    return this.http.put<number>('http://127.0.0.1:5000/actionblue', grid);
  }
  DqnRed(grid: Grid): Observable<number> {
    return this.http.put<number>('http://127.0.0.1:5000/red', grid);
  }

  savebrain1(): Observable<string> {
    return this.http.get<string>('http://127.0.0.1:5000/savebrain1');
  }
  savebrain2(): Observable<string> {
    return this.http.get<string>('http://127.0.0.1:5000/savebrain2');
  }
  loadbrain2(): Observable<string> {
    return this.http.get<string>('http://127.0.0.1:5000/loadbrain2');
  }
  loadbrain1(): Observable<string> {
    return this.http.get<string>('http://127.0.0.1:5000/loadbrain1');
  }


}
