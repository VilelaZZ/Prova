import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProdutoService } from '../produto.service';

@Component({
  selector: 'app-produto-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './produto-form.html',
  styleUrl: './produto-form.css'
})
export class ProdutoForm implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(ProdutoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id: number | null = null;
  erro = signal('');

  form = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    descricao: [''],
    categoria: ['', Validators.required],
    quantidade: [0, [Validators.required, Validators.min(0)]],
    estoqueMinimo: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = Number(idParam);
      this.service.buscar(this.id).subscribe(p => this.form.patchValue(p));
    }
  }

  salvar() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const dados = this.form.getRawValue();
    const req = this.id ? this.service.atualizar(this.id, dados) : this.service.criar(dados);
    req.subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.erro.set('Erro ao salvar. Verifique os campos.')
    });
  }
}