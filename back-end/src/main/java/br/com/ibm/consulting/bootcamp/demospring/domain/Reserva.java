package br.com.ibm.consulting.bootcamp.demospring.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table
public class Reserva {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String usuario;
    @JsonProperty("data_inicio")
    private String dataInicio;
    @JsonProperty("data_fim")
    private String dataFim;

    @ManyToOne
    @JoinColumn(name = "livro_id")
    private Livro livro;

    public Reserva() {};

    public Reserva(Livro livro, String usuario, String dataInicio, String dataFim) {
        this.livro = livro;
        this.usuario = usuario;
        this.dataFim = dataFim;
        this.dataInicio = dataInicio;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getDataInicio() {
        return dataInicio;
    }

    public void setDataInicio(String dataInicio) {
        this.dataInicio = dataInicio;
    }

    public String getDataFim() {
        return dataFim;
    }

    public void setDataFim(String dataFim) {
        this.dataFim = dataFim;
    }

    public Livro getLivro() {
        return this.livro;
    }

    public void setLivro(Livro livro) {
        this.livro = livro;
    }

    public long getId() {
        return id;
    }
}
