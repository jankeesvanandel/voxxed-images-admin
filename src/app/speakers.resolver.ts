import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Speaker } from './model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SpeakersResolver implements Resolve<Speaker[]> {

  constructor(private httpClient: HttpClient) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Speaker[]> {
    return this.httpClient.get<string[]>('/api/lienify/speakers/all').pipe(
      map(speakers => {
        return Object.entries(speakers).map(([key, value]) => {
          return { id: key, name: value };
        });
      })
    );
  }

}
