import { Component } from '@angular/core';

@Component({
  selector: 'app-persona-table',
  templateUrl: './persona-table.component.html',
  styleUrls: ['./persona-table.component.css']
})
export class PersonaTableComponent {
  displayedColumns: string[] = ['fullName', 'dni', 'edad', 'genero'];
}
