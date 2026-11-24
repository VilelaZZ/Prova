import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Produto } from './produto';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private http = inject(HttpClient);
  private url = 'http://localhost:8080/api/produtos';

  listar()                          { return this.http.get<Produto[]>(this.url); }
  buscar(id: number)                { return this.http.get<Produto>(`${this.url}/${id}`); }
  criar(p: Produto)                 { return this.http.post<Produto>(this.url, p); }
  atualizar(id: number, p: Produto) { return this.http.put<Produto>(`${this.url}/${id}`, p); }
  excluir(id: number)               { return this.http.delete<void>(`${this.url}/${id}`); }
}