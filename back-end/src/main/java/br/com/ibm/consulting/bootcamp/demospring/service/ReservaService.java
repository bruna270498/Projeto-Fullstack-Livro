package br.com.ibm.consulting.bootcamp.demospring.service;

import br.com.ibm.consulting.bootcamp.demospring.domain.Exemplar;
import br.com.ibm.consulting.bootcamp.demospring.domain.Reserva;
import br.com.ibm.consulting.bootcamp.demospring.exception.ErrorIdNotFoundException;
import br.com.ibm.consulting.bootcamp.demospring.repository.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservaService {
    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private ExemplarService exemplarService;

    @Autowired
    private LivroService livroService;

    public Reserva novaReserva(Reserva r, long id) {
        Exemplar exemplar = exemplarService.exemplar(id);
        if (exemplar == null || exemplar.getQuantidade() <= 0) {
            throw new ErrorIdNotFoundException("Exemplar não disponível para reserva.");
        }

        exemplar.setQuantidade(exemplar.getQuantidade() - 1);
        exemplarService.atualizar(exemplar);

        Reserva e = new Reserva(livroService.obter(exemplar.getLivroId()),r.getUsuario(), r.getDataInicio(), r.getDataFim());
        return reservaRepository.saveAndFlush(e);
    }

    public List<Reserva> reservas(){
        return reservaRepository.findAll();
    }

    public  Reserva reservaId(long id){
     return reservaRepository.findById(id).orElse(null);
    }

    public List<Reserva> ListaReservasLivro(long id) {
        return  reservaRepository.findByLivroId(id);
    }
    public void excluir(long id) {
        if (reservaRepository.existsById(id)){
            var e = exemplarService.exemplar(id);
            e.setQuantidade(e.getQuantidade() + 1);
            exemplarService.atualizar(e);
            reservaRepository.deleteById(id);
        }
        else {
            throw new ErrorIdNotFoundException("Reserva não encontrada com o ID: " + id);
        }
    }
}
