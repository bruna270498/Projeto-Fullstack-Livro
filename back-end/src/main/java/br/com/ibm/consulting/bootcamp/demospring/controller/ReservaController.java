package br.com.ibm.consulting.bootcamp.demospring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

import br.com.ibm.consulting.bootcamp.demospring.domain.Reserva;
import br.com.ibm.consulting.bootcamp.demospring.exception.ErrorIdNotFoundException;
import br.com.ibm.consulting.bootcamp.demospring.service.ExemplarService;
import br.com.ibm.consulting.bootcamp.demospring.service.ReservaService;

import java.util.List;

@RestController
@RequestMapping("api/livros")
@CrossOrigin(origins = "*")
public class ReservaController {

    @Autowired
    ReservaService reservaService;

    @Autowired
    ExemplarService exemplarService;

    // Cria uma nova reserva e atualiza o exemplar.
    @PostMapping("{id}/reservas")
    @ResponseStatus(HttpStatus.CREATED)
    public Reserva newReserva(@PathVariable long id,@RequestBody Reserva reserva){
        return reservaService.novaReserva(reserva, id);
    }

    //apaga a reserva do livro e atualiza quantidade no exemplar.
    @DeleteMapping("reservas/{idReserva}")
    public ResponseEntity<Void> deletaReserva(@PathVariable long idReserva) {
        try {
            reservaService.excluir(idReserva);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (ErrorIdNotFoundException ex) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //Retorna todas as reservas.
    @GetMapping("/reservas")
    @ResponseStatus(HttpStatus.OK)
    public List<Reserva> reservas() {
        return reservaService.reservas();
    }

    //Retorna reserva por id.
    @GetMapping("reservas/{idReserva}")
    public ResponseEntity<Reserva> reserva(@PathVariable long idReserva) {
        Reserva r = reservaService.reservaId(idReserva);
       if(r != null) {
           return new ResponseEntity<>(r, HttpStatus.OK);
       }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    //Retorna reserva por id do livro.
    @GetMapping("{id}/reservas")
    public ResponseEntity<Reserva> reservaLivroId(@PathVariable long id) {
        Reserva r = reservaService.reservaId(id);
        if(r != null) {
            return new ResponseEntity<>(r, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
