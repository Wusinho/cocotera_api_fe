import { Routes } from '@angular/router';
import { SessionComponent } from './views/session/session.component';
import { ClientListComponent } from './views/client-list/client-list.component';
import { EditClientComponent } from './components/edit-client/edit-client.component';
import { FacturaCreateComponent } from './facturas/factura-create/factura-create.component';
import { FacturaViewComponent } from './facturas/factura-view/factura-view.component';
import { ProductsListComponent } from './views/products-list/products-list.component';
import { AuthGuard } from './auth.guard';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ClientFormComponent } from './components/client-form/client-form.component';

export const routes: Routes = [
  { path: '', component: SessionComponent },
  { path: 'clients', component: ClientListComponent, canActivate: [AuthGuard] },
  {
    path: 'clients/create',
    component: ClientFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'clients/edit/:id',
    component: ClientFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'facturas/create/:clientId',
    component: FacturaCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'facturas/show/:clientId',
    component: FacturaViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'productos',
    component: ProductsListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'productos/create',
    component: ProductFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'productos/edit/:id',
    component: ProductFormComponent,
    canActivate: [AuthGuard],
  },
];
