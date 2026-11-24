import { Routes } from '@angular/router';
import { ProdutoLista } from './produto-lista/produto-lista';
import { ProdutoForm } from './produto-form/produto-form';

export const routes: Routes = [
  { path: '', component: ProdutoLista },
  { path: 'novo', component: ProdutoForm },
  { path: 'editar/:id', component: ProdutoForm },
];