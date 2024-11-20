import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ItemListComponent } from './pages/item-list/item-list.component';
import { LoginComponent } from './login/login.component';
import { ImageCaptureComponent } from './pages/image-capture/image-capture.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'items',
    pathMatch: 'full'
  },
  {
    path: 'items',
    component: ItemListComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'image-capture',
    component: ImageCaptureComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
