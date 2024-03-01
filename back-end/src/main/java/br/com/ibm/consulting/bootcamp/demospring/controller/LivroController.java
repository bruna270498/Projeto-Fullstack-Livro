package br.com.ibm.consulting.bootcamp.demospring.controller;

import java.util.List;

import br.com.ibm.consulting.bootcamp.demospring.domain.Exemplar;
import br.com.ibm.consulting.bootcamp.demospring.exception.ErrorIdNotFoundException;
import br.com.ibm.consulting.bootcamp.demospring.service.ExemplarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.ibm.consulting.bootcamp.demospring.domain.Livro;
import br.com.ibm.consulting.bootcamp.demospring.service.LivroService;

@RestController
@RequestMapping("/api/livros")
@CrossOrigin(origins = "*")
public class LivroController {
	
	@Autowired
	LivroService service;

	@Autowired
	ExemplarService exemplarService;
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public Livro criar(@RequestBody Livro livro) {
		return service.criarLivro(livro);
	}
	
	@GetMapping
	public List<Livro> listar() {
		return service.listar();
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Livro> obter(@PathVariable long id) {
		var livro = service.obter(id);
		if (livro != null) {
			return new ResponseEntity<Livro>(livro, HttpStatus.OK);
		}
		return new ResponseEntity<Livro>(livro, HttpStatus.NOT_FOUND);
	}
	
	@PutMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public ResponseEntity<Void> atualizar(@RequestBody Livro livro, @PathVariable long id) {
		var livroExistente = service.obter(id);
		if (livroExistente != null) {
			service.alterar(id, livro);
			return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<Void>(HttpStatus.NOT_FOUND);
	}
	
	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public ResponseEntity<Void> excluir(@PathVariable long id) {
		var livroExistente = service.obter(id);
		if (livroExistente != null) {
			service.excluir(id);
			return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<Void>(HttpStatus.NOT_FOUND);
	}

	/**
	 *Criação e conexão de exemplares com os livros.
	 * Este método retorna um exemplar com base no ID fornecido do livro.
	 */

	@PostMapping("/{id}/exemplares")
	@ResponseStatus(HttpStatus.CREATED)
	public Exemplar novoExemplar(@PathVariable Long id, @RequestBody Exemplar exemplar) {
		return exemplarService.criarExemplar(id,exemplar.getQuantidade());
	}

	@DeleteMapping("/{id}/exemplares")
	public ResponseEntity<Void> deletarExemplar(@PathVariable long id) {
		try {
			exemplarService.excluir(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (ErrorIdNotFoundException ex) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@GetMapping("/{id}/exemplares")
	public ResponseEntity<Exemplar> exemplarId(@PathVariable long id) {
		var exemplar = exemplarService.exemplar(id);
		if ( exemplar != null) {
			return new ResponseEntity<>(exemplar, HttpStatus.OK);
		}else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@PutMapping("/{id}/exemplares")
	public ResponseEntity<Void> atualizarExemplar(@PathVariable long id, @RequestBody Exemplar e){
		var exemplar = exemplarService.exemplar(id);
		if (exemplar != null) {
			exemplar.setQuantidade(e.getQuantidade());
			exemplarService.atualizar(exemplar);
			return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
		} else {
			return new ResponseEntity<Void>(HttpStatus.NOT_FOUND);
		}
	}
}
