import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs';
import { Reserva } from '../interface/reserva';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private url = "http://localhost:8080/api/livros";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http:HttpClient) { }

  cadastrar(id:number, reserva: Reserva):Observable<Reserva>{    
    return this.http.post<Reserva>(`${this.url}/${id}/reservas`, reserva);
  }

  reservas():Observable<Reserva[]>{
    return this.http.get<Reserva[]>(`${this.url}/reservas`);
  }

  excluir(id:number):Observable<void>{
    return this.http.delete<void>(`${this.url}/reservas/${id}`);
  }
}
