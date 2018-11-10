import { Component, OnInit } from '@angular/core';
import { Album, FlickrPhotoSize, Image } from '../model';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, from, of } from 'rxjs';
import { FlickrService } from '../flickr.service';
import { filter, flatMap, map, skip, take, toArray } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, PageEvent } from '@angular/material';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss']
})
export class AlbumComponent implements OnInit {

  speakerId: string;
  speakerName: string;
  albumName: string;
  imageList: Image[];

  pageEvent: PageEvent;
  dataSource: Image[];
  pageIndex;
  pageSize;
  length: number;

  constructor(private route: ActivatedRoute, private flickrService: FlickrService, private httpClient: HttpClient,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    combineLatest(this.route.data, this.route.params).subscribe(([data, params]) => {
      const speaker = data.speakers.find(s => s.id === params['speaker']);
      this.speakerId = speaker.id;
      this.speakerName = speaker.name;
      this.albumName = params['album'];

      from(data.albums as Album[]).pipe(
        filter(a => a.name === this.albumName),
        map(a => a.images)
      ).subscribe(is => {
        this.imageList = is;
        this.length = is.length;
        this.getServerData({
          pageIndex: 0,
          pageSize: 10,
          length: is.length
        });
      });
    });
  }

  public getServerData(event?: PageEvent) {
    from(this.imageList).pipe(
      skip(event.pageIndex * event.pageSize),
      take(event.pageSize),
      flatMap((i: Image) => {
        const localFlickrData = window.localStorage.getItem(`flickr/${i.id}`);
        if (localFlickrData) {
          i.image = JSON.parse(localFlickrData) as FlickrPhotoSize;
          return of(i);
        } else {
          return this.flickrService.getImageSizes(i.id).pipe(
            map(fpgs => fpgs.sizes.size.filter(s => s.width >= 320)[0]),
            map(s => {
              i.image = s;
              window.localStorage.setItem(`flickr/${i.id}`, JSON.stringify(s));
              return i;
            })
          );

        }
      }),
      toArray()
    ).subscribe(enhancedImages => {
      this.dataSource = enhancedImages;
      this.pageIndex = event.pageIndex;
      this.pageSize = event.pageSize;
    });

    return event;
  }


  updateValidation(image: Image) {
    let validationStr = 'null';
    if (image.validation === true) {
      validationStr = 'true';
    } else if (image.validation === false) {
      validationStr = 'false';
    }

    const formData: FormData = new FormData();
    formData.append('album', this.albumName);
    formData.append('validation', validationStr);

    this.httpClient.post(`/api/lienify/speakers/${this.speakerId}/${image.id}/validation`, formData, { responseType: 'text' })
      .subscribe(ok => {
        this.snackBar.open('successful update', null, { duration: 2000 });
      }, error => {
        console.log(error);
      });
  }
}
