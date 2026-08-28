import {Routes} from '@angular/router';
import {Home} from './components/home/home';
import {Search} from './components/search/search';
import {Register} from './components/register/register';
import {Admin} from './components/admin/admin';
import {WorkerLogin} from './components/worker-login/worker-login';
import {WorkerDashboard} from './components/worker-dashboard/worker-dashboard';
import {workerAuthGuard} from './guards/worker-auth.guard';

export const routes: Routes = [
  {path: '', component: Home},
  {path: 'search', component: Search},
  {path: 'register', component: Register},
  {path: 'admin', component: Admin},
  {path: 'worker-login', component: WorkerLogin},
  {path: 'worker-dashboard', component: WorkerDashboard, canActivate: [workerAuthGuard]},
  {path: '**', redirectTo: ''},
];
