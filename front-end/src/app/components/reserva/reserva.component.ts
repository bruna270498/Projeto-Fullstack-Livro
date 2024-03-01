import { Component, Input , OnInit} from '@angular/core';
import { Data } from '@angular/router';
import { ReservaService } from '../../service/reserva.service';
import { Reserva } from '../../interface/reserva';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.css'
})
export class ReservaComponent {
    reserva: Reserva = {
    usuario: '',
    data_inicio: '',
    data_fim: ''
  };

  todasReservas: Reserva[] = [];
  reservaFiltrada: Reserva[] = [];

  reservaAtiva = true;
  constructor(private serviceReserva: ReservaService){}

  // Método de inicialização do componente
  ngOnInit(){this.carregarReserva()}

  /**
   * Cadastra uma nova reserva para o livro especificado.
   * @param usuario O nome do usuário para a reserva.
   * @param id O ID do livro para o qual a reserva está sendo feita.
   */
  novaReserva(usuario: string, id: number){
   const dataAtual: Data = new Date();
   const dataDepoisDe15Dias: Date = new Date();
   dataDepoisDe15Dias.setDate(dataAtual['getDate']() + 15);

   const data = this.formatarData(dataAtual);
   const data15dias = this.formatarData(dataDepoisDe15Dias);

   const obj = {usuario, "data_inicio": data, "data_fim": data15dias};
   return this.serviceReserva.cadastrar(id, obj).subscribe((e) => this.reserva = e)
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

  // Fecha o formulário de reserva
  fecharForm() {this.reservaAtiva = !this.reservaAtiva}

  // Carrega a lista de reservas
  carregarReserva(){
    this.serviceReserva.reservas().subscribe((e) => {
      this.todasReservas = e;
      this.reservaFiltrada = e;
    });
  }

  /**
   * Filtra as reservas com base no termo de pesquisa fornecido.
   * @param termo O termo de pesquisa.
   */
  filtrarReservas(termo:string){
    if (termo.trim() !== '') {
      this.reservaFiltrada = this.todasReservas.filter(reservas =>
        // aqui eu coloco tudo em TOLOWERCASE para verificar melhor a igualdade
        reservas.usuario.toLowerCase().includes(termo.toLowerCase()) ||
        reservas.livro.titulo.toLowerCase().includes(termo.toLowerCase()),
        console.log(this.todasReservas)
        
      );
    } else {
      this.reservaFiltrada = this.todasReservas;
    }
  }

  /**
   * Exclui a reserva com o ID especificado.
   * @param id O ID da reserva a ser excluída.
   */
  exluirReserva(id: number){
    this.serviceReserva.excluir(id).subscribe((e) => {
      alert('Reserva baixada com sucesso!!!');
      this.carregarReserva();
    });
  }

}
