
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Produto, ProdutoService } from './services/produto.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  produtos: Produto[] = [];

  formulario: Produto = this.novoFormulario();
  produtoEmEdicao: Produto | null = null;

  constructor(private produtoService: ProdutoService) {}

  ngOnInit(): void {
    this.listarProdutos();
  }

  novoFormulario(): Produto {
    return {
      nome: '',
      descricao: '',
      categoria: '',
      quantidade: 0,
      estoqueMinimo: 0
    };
  }

  listarProdutos(): void {
    this.produtoService.listar().subscribe({
      next: (dados) => {
        this.produtos = dados;
      },
      error: (erro) => {
        console.error('Erro ao listar produtos:', erro);
      }
    });
  }

  salvarProduto(): void {
    const operacao = this.produtoEmEdicao
      ? this.produtoService.editar(this.produtoEmEdicao.id!, this.formulario)
      : this.produtoService.cadastrar(this.formulario);

    operacao.subscribe({
      next: () => {
        this.listarProdutos();
        this.cancelarEdicao();
        alert('Produto salvo com sucesso!');
      },
      error: (erro) => {
        console.error('Erro ao salvar produto:', erro);
        alert('Não foi possível salvar o produto.');
      }
    });
  }

  editarProduto(produto: Produto): void {
    this.produtoEmEdicao = produto;
    this.formulario = { ...produto };
  }

  excluirProduto(id: number): void {
    if (confirm('Deseja realmente excluir este produto?')) {
      this.produtoService.excluir(id).subscribe({
        next: () => {
          this.listarProdutos();
          alert('Produto excluído com sucesso!');
        },
        error: (erro) => {
          console.error('Erro ao excluir produto:', erro);
          alert('Não foi possível excluir o produto.');
        }
      });
    }
  }

  cancelarEdicao(): void {
    this.produtoEmEdicao = null;
    this.formulario = this.novoFormulario();
  }

  estoqueBaixo(produto: Produto): boolean {
    return produto.estoqueBaixo ??
      produto.quantidade <= produto.estoqueMinimo;
  }
}
