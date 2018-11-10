import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Album } from './model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AlbumsResolver implements Resolve<Album[]> {

  constructor(private httpClient: HttpClient) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Album[]> {
    const id = route.params['speaker'];

    return this.httpClient.get<Album[]>(`/api/lienify/speakers/${id}`).pipe(
      map(albums => {
        albums.forEach(a => {
          a.images.forEach(i => {
            if (i.validation as any === 'true') {
              i.validation = true;
            } else if (i.validation as any === 'false') {
              i.validation = false;
            } else if (i.validation as any === 'null') {
              i.validation = null;
            }
          });
        });

        return albums;
      })
    );
  }

}
