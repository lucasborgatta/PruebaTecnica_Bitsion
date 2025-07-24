import { Component } from '@angular/core';
import { Persona } from 'src/app/models/persona.model';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
})
export class MainLayoutComponent {
  personaSeleccionada?: Persona;

  logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}
}
