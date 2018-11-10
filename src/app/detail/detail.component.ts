import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Album } from '../model';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  speakerId: string;
  speakerName: string;
  albums: Album[] = [];

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    combineLatest(this.route.data, this.route.params).subscribe(([data, params]) => {
      const speaker = data.speakers.find(s => s.id === params['speaker']);
      this.speakerId = speaker.id;
      this.speakerName = speaker.name;
      this.albums = data.albums.filter(a => a.images && a.images.length > 0);
    });
  }

}
