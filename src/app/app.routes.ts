import { Routes } from '@angular/router';
import { SessionComponent } from './views/session/session.component';
import { ClientListComponent } from './components/client-list/client-list.component';
import { EditClientComponent } from './components/edit-client/edit-client.component';
import { FacturaCreateComponent } from './facturas/factura-create/factura-create.component';
import { FacturaViewComponent } from './facturas/factura-view/factura-view.component';

export const routes: Routes = [
  { path: '', component: SessionComponent },
  { path: 'clients', component: ClientListComponent },
  { path: 'clients/edit/:id', component: EditClientComponent },
  { path: 'facturas/create/:clientId', component: FacturaCreateComponent },
  { path: 'facturas/show/:clientId', component: FacturaViewComponent}

];
