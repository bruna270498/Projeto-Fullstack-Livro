import { Injectable } from '@angular/core';
import { Livro } from '../interface/livro';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs';
import { Exemplar } from '../interface/exemplar';

@Injectable({
  providedIn: 'root'
})
export class LivroService {
  private url = "http://localhost:8080";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http:HttpClient) { }

  todosLivros():Observable<Livro[]>{    
    return this.http.get<Livro[]>(`${this.url}/api/livros`);
  }

  novoLivro(Livro: Livro): Observable<Livro> {    
    return this.http.post<Livro>(`${this.url}/api/livros`, Livro);
  }

  excluirLivro(id: number) {
    return this.http.delete(`${this.url}/api/livros/${id}`);
  }

  novoExemplar(quantidade: Exemplar, id: number) :Observable<void>{
    return this.http.post<void>(`${this.url}/api/livros/${id}/exemplares`, quantidade);
  }

  obterExemplar(id: number): Observable<Exemplar>{
    return this.http.get<Exemplar>(`${this.url}/api/livros/${id}/exemplares`);
  }

  atualizarExemplar(id:number, quantidade:Exemplar): Observable<void>{
    return this.http.put<void>(`${this.url}/api/livros/${id}/exemplares`, quantidade);
  }
}
