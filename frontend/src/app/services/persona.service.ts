import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Persona } from '../models/persona.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PersonaService {
  private apiURL = 'http://localhost:5264/api/Persona';
  // Observable que se utiliza para emitir los valores mas actuales para que lo reciban los componentes suscriptos, con esto avisamos que la lista de personas cambio para actualizar la tabla
  private personasActualizadas = new BehaviorSubject<void>(undefined);

  constructor(private http: HttpClient) {}

  getPersonas(): Observable<Persona[]> {
    return this.http.get<Persona[]>(this.apiURL);
  }

  createPersona(persona: Persona): Observable<Persona> {
    return this.http.post<Persona>(this.apiURL, persona);
  }

  updatePersona(id: number, persona: Persona): Observable<Persona> {
    return this.http.put<Persona>(`${this.apiURL}/${id}`, persona);
  }

  deletePersona(id: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`);
  }

  // Funcion que devuelve el observable para saber cuando ocurren los cambios
  getPersonasActualizadas() {
    return this.personasActualizadas.asObservable();
  }

  // Funcion para emitir la notificacion de que se realizo un cambio
  notificarPersonasActualizadas() {
    this.personasActualizadas.next();
  }
}
