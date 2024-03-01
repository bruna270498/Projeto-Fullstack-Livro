package br.com.ibm.consulting.bootcamp.demospring.service;

import br.com.ibm.consulting.bootcamp.demospring.domain.Exemplar;
import br.com.ibm.consulting.bootcamp.demospring.domain.Livro;
import br.com.ibm.consulting.bootcamp.demospring.exception.ErrorIdNotFoundException;
import br.com.ibm.consulting.bootcamp.demospring.repository.ExemplarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ExemplarService {

    @Autowired
    ExemplarRepository exemplarRepository;

    @Autowired
    LivroService livroService;

    public Exemplar criarExemplar(Long id, int quantidade) {
        Livro livro = livroService.obter(id);
        Exemplar exemplar = new Exemplar();
        exemplar.setLivro(livro);
        exemplar.setQuantidade(quantidade);
        return exemplarRepository.saveAndFlush(exemplar);
    }


    public Exemplar exemplar(long id) {
        return exemplarRepository.findById(id).orElse(null);
    };
    public void atualizar(Exemplar atual) {
        exemplarRepository.saveAndFlush(atual);
    };

    public void excluir(long id) {
        if (exemplarRepository.existsById(id)) {
            exemplarRepository.deleteById(id);
        } else {
            throw  new ErrorIdNotFoundException("Exemplar não encontrado pelo id:" + id);
        }
    };
}
