import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { NewComponent } from './new/new.component';
import { DetailComponent } from './detail/detail.component';
import { AlbumComponent } from './album/album.component';
import { AlbumsResolver } from './albums.resolver';
import { SpeakersResolver } from './speakers.resolver';

const routes: Routes = [
  {
    path: '',
    resolve: {
      speakers: SpeakersResolver
    },
    children: [
      {
        path: '',
        component: ListComponent
      },
      {
        path: 'new',
        component: NewComponent
      },
      {
        path: 'detail/:speaker',
        resolve: {
          albums: AlbumsResolver
        },
        children: [
          {
            path: '',
            component: DetailComponent
          },
          {
            path: 'album/:album',
            component: AlbumComponent
          }
        ]

      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'corrected' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
