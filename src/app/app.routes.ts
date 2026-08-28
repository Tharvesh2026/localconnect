import {Routes} from '@angular/router';
import {Home} from './components/home/home';
import {Search} from './components/search/search';
import {Register} from './components/register/register';
import {Admin} from './components/admin/admin';

export const routes: Routes = [
  {path: '', component: Home},
  {path: 'search', component: Search},
  {path: 'register', component: Register},
  {path: 'admin', component: Admin},
  {path: '**', redirectTo: ''},
];
