import { Routes } from '@angular/router';
import { SessionComponent } from './views/session/session.component';
import { ClientListComponent } from './components/client-list/client-list.component';

export const routes: Routes = [
  { path: '', component: SessionComponent },
  { path: 'clients', component: ClientListComponent}
];
