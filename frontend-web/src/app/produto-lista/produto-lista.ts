import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProdutoService } from '../produto.service';
import { Produto } from '../produto';

@Component({
  selector: 'app-produto-lista',
  imports: [RouterLink, FormsModule],
  templateUrl: './produto-lista.html',
  styleUrl: './produto-lista.css'
})
export class ProdutoLista implements OnInit {
  private service = inject(ProdutoService);

  produtos = signal<Produto[]>([]);
  categoriaFiltro = signal('');
  erro = signal('');

  categorias = computed(() => [...new Set(this.produtos().map(p => p.categoria))]);
  filtrados = computed(() =>
    this.categoriaFiltro()
      ? this.produtos().filter(p => p.categoria === this.categoriaFiltro())
      : this.produtos()
  );

  ngOnInit() { this.carregar(); }

  carregar() {
    this.service.listar().subscribe({
      next: dados => { this.produtos.set(dados); this.erro.set(''); },
      error: () => this.erro.set('Não foi possível carregar os produtos. A API está rodando?')
    });
  }

  estoqueBaixo(p: Produto) { return p.quantidade <= p.estoqueMinimo; }

  excluir(p: Produto) {
    if (!confirm(`Excluir "${p.nome}"?`)) return;
    this.service.excluir(p.id!).subscribe({
      next: () => this.carregar(),
      error: () => this.erro.set('Erro ao excluir.')
    });
  }
}