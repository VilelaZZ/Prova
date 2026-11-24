
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Produto {
  id?: number;
  nome: string;
  descricao: string;
  categoria: string;
  quantidade: number;
  estoqueMinimo: number;
  estoqueBaixo?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private api = 'http://localhost:8080/api/produtos';

  constructor(private http: HttpClient) {}

  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.api);
  }

  cadastrar(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.api, produto);
  }

  editar(id: number, produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.api}/${id}`, produto);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
