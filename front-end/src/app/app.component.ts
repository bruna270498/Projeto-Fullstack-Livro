import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Data, RouterOutlet } from '@angular/router';
import { LivroService } from './service/livro.service';
import { Livro } from './interface/livro';
import { Exemplar } from './interface/exemplar';
import { ReservaComponent } from './components/reserva/reserva.component';
import { map, switchMap } from 'rxjs';
import { ReservaService } from './service/reserva.service';
import { Reserva } from './interface/reserva';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReservaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front-IBM';

  livros: Livro[] = [];
  livroFiltrado = this.livros; 

  mostrarLivro = false;
  mostraQuantidade = false;

  quantidadePorLivro: { [id: number]: number } = {};
  novoExemplar = {bool: false, id: 0};

  reserva = false;

  reservaObj: Reserva = {
    usuario: '',
    data_inicio: '',
    data_fim: ''
  };

  idReserva: number = 0;

  reservaAtivado: boolean = false;

  text: string = 'Reservas';

  constructor(private livroService: LivroService, private serviceReserva: ReservaService){
  }

  /**
   * Inicializa o componente, carregando os livros existentes.
   */
  ngOnInit(){this.carregarLivro()}

  /**
   * Carrega a lista de livros.
   */
  carregarLivro() {
    this.livroService.todosLivros().subscribe((livros: Livro[]) => {
      this.livros = livros;
      this.livroFiltrado = livros;
    });
  }
  
  /**
   * Filtra os livros com base no termo de pesquisa.
   * @param termo O termo de pesquisa.
   */
  filtrarLivro(termo: string) {
    // Verifico se há livro ou autor na pesquisa
    if (termo.trim() !== '') {
      this.livroFiltrado = this.livros.filter(livro =>
        // aqui eu coloco tudo em TOLOWERCASE para verificar melhor a igualdade
        livro.titulo.toLowerCase().includes(termo.toLowerCase()) ||
        livro.autor.toLowerCase().includes(termo.toLowerCase())
      );
    } else {
      this.livroFiltrado = this.livros;
    }
  }

  /**
   * Exclui um livro.
   * @param id O ID do livro a ser excluído.
   */
  excluirLivro(id: number) {
    this.livroService.excluirLivro(id).subscribe(() => {
      console.log('Livro excluído com sucesso');
      alert('Livro excluído com sucesso');
      this.carregarLivro();
    }, error => {
      console.error('Erro ao excluir o livro:', error);
    });
  }

  /**
   * Alterna a exibição do formulário de cadastro de livro.
   */
  toggleLivro(): void {
    this.mostrarLivro = !this.mostrarLivro;
  }

  /**
   * Alterna a exibição da quantidade de exemplares para um livro.
   */
  toggleExemplar(): void {
    this.mostraQuantidade = !this.mostraQuantidade;
    this.quantidadePorLivro = {};
  }

  /**
   * Obtém a quantidade de exemplares para um livro.
   * @param id O ID do livro.
   */
  exemplarId(id: number) {
    this.toggleExemplar();
    this.livroService.obterExemplar(id).subscribe(
      (exemplar: Exemplar) => {
        this.quantidadePorLivro[id] = exemplar.quantidade;
      },
      (error) => {
        console.error('Erro ao obter exemplar:', error);
        console.error('Erro ao obter exemplar:', error);
        if (error.status === 404) {
          this.novoExemplar = { bool: !this.novoExemplar.bool, id };
          alert('Exemplar não encontrado');
          // Aqui você pode adicionar lógica adicional, como mostrar um botão para cadastrar exemplar
        } else {
          alert('Erro ao obter exemplar. Por favor, tente novamente mais tarde.');
        }
      }
    );
  }

  /**
   * Cadastra um novo exemplar para um livro.
   * @param id O ID do livro.
   * @param valor A quantidade de exemplares.
   */
  cadastrarExemplar(id:number, valor:string){
    const obj = {quantidade: parseInt(valor)};
    this.livroService.novoExemplar(obj, id).subscribe();
  }

  /**
   * Atualiza a quantidade de exemplares para um livro.
   * @param id O ID do livro.
   * @param quantidade A nova quantidade de exemplares.
   */
  atualizarExemplar(id:number, quantidade: string){
    const obj = {"quantidade": parseInt(quantidade)}
    this.livroService.atualizarExemplar(id, obj).subscribe();
  }

  /**
   * Alterna a exibição do componente de reserva e define o ID do livro selecionado para reserva.
   * @param id O ID do livro selecionado para reserva.
   */
  toggleReserva(id:number):void{
    this.reserva = !this.reserva;
    this.idReserva = id;
  }

  /**
   * Cadastra um novo livro, incluindo um exemplar, e exibe uma mensagem de sucesso.
   * @param titulo O título do novo livro.
   * @param autor O autor do novo livro.
   * @param anoPublicacao O ano de publicação do novo livro.
   * @param valor A quantidade inicial de exemplares do novo livro.
   */
  cadastrarLivro(titulo: string, autor: string, anoPublicacao: string, valor: string): void {
    const livroObj = { titulo, autor, "ano_publicacao": anoPublicacao };
    
    // Realizo uma chamada para criar o livro e, em seguida, cria um exemplar para o livro criado
    this.livroService.novoLivro(livroObj).pipe(
      switchMap((livroCriado) => {
        const exemplarObj = { quantidade: parseInt(valor), "livro-id": livroCriado.id };
        return this.livroService.novoExemplar(exemplarObj, livroCriado.id!).pipe(
          map(() => livroCriado) // Estou passando o livro criado para o próximo estágio do pipe
        );
      })
    ).subscribe();
    alert("Livro cadastrado com sucesso!!!");
  }

  /**
   * Cria uma nova reserva para um livro com o usuário fornecido e exibe os dados da reserva.
   * @param usuario O nome do usuário para a reserva.
   * @param id O ID do livro para o qual a reserva está sendo feita.
   */
  novaReserva(usuario: string, id: number){
    const dataAtual: Data = new Date();
    const dataDepoisDe15Dias: Date = new Date();
    dataDepoisDe15Dias.setDate(dataAtual['getDate']() + 15);
 
    const data = this.formatarData(dataAtual);
    const data15dias = this.formatarData(dataDepoisDe15Dias);

    if (this.quantidadePorLivro[id] === 0) {
      alert("Não tem exemplar disponível para reserva");
    }
    
    const obj = {usuario, "data_inicio": data, "data_fim": data15dias};
    return this.serviceReserva.cadastrar(id, obj).subscribe((e) => this.reservaObj = e)
  }
 
  /**
   * Formata a data fornecida no formato "dia / mês / ano".
   * @param data A data a ser formatada.
   * @returns A data formatada.
   */
  formatarData(data: Data) {
     const dia: number = data['getDate']();
     const mes: number = data['getMonth']() + 1; // Mês é zero indexado, então adicionamos 1
     const ano: number = data['getFullYear']();
     return `${dia} / ${mes} / ${ano}`;
  }

  /**
   * Alterna a exibição do componente de reserva entre "Livros" e "Reservas".
   */
  toogleComponeteReserva(){
    const LIVROS_TEXT = 'Livros';
    const RESERVAS_TEXT = 'Reservas';
    this.reservaAtivado = !this.reservaAtivado;
    this.text = !this.reservaAtivado ? RESERVAS_TEXT : LIVROS_TEXT;
  }
  
}
