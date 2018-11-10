import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FlickrPhotosGetSizes } from './model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FlickrService {

  private apiKey = '2a490fb19808a352fd7c5de8a98a1fe1';

  constructor(private httpClient: HttpClient) {
  }

  getImageSizes(id: string): Observable<FlickrPhotosGetSizes> {
    const apiMethod = 'flickr.photos.getSizes';

    return this.execute<FlickrPhotosGetSizes>(apiMethod, id);
  }

  private execute<T>(apiMethod: string, id: string): Observable<T> {
    return this.httpClient.get<T>(`flickr/?method=${apiMethod}&api_key=${this.apiKey}&photo_id=${id}&format=json&nojsoncallback=1`);
  }
}
