
package com.stockflow.backend.service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import com.stockflow.backend.dto.MovimentacaoRequest;
import com.stockflow.backend.model.Produto;
import com.stockflow.backend.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    public List<Produto> listarTodos() {
        return produtoRepository.findAll();
    }

    public Produto buscarPorId(Long id) {
    return produtoRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Produto não encontrado"
            ));
}

    public Produto salvar(Produto produto) {
        return produtoRepository.save(produto);
    }

    public Produto atualizar(Long id, Produto produtoAtualizado) {
        Produto produto = buscarPorId(id);

        produto.setNome(produtoAtualizado.getNome());
        produto.setDescricao(produtoAtualizado.getDescricao());
        produto.setCategoria(produtoAtualizado.getCategoria());
        produto.setQuantidade(produtoAtualizado.getQuantidade());
        produto.setEstoqueMinimo(produtoAtualizado.getEstoqueMinimo());

        return produtoRepository.save(produto);
    }

    public void excluir(Long id) {
        Produto produto = buscarPorId(id);
        produtoRepository.delete(produto);
    }
    public Produto movimentarEstoque(Long id, MovimentacaoRequest movimentacao) {
    Produto produto = buscarPorId(id);

    int quantidade = movimentacao.getQuantidade();

    if ("ENTRADA".equalsIgnoreCase(movimentacao.getTipo())) {

        produto.setQuantidade(produto.getQuantidade() + quantidade);

    } else if ("SAIDA".equalsIgnoreCase(movimentacao.getTipo())) {

        if (produto.getQuantidade() < quantidade) {
            throw new IllegalArgumentException(
                "Estoque insuficiente para realizar a saída"
            );
        }

        produto.setQuantidade(produto.getQuantidade() - quantidade);

    } else {
        throw new IllegalArgumentException(
            "Tipo inválido. Use ENTRADA ou SAIDA"
        );
    }

    return produtoRepository.save(produto);
}
}
