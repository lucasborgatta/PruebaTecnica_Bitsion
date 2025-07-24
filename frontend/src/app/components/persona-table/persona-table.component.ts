import { Component, EventEmitter, Output, ViewChild, AfterViewInit } from '@angular/core';
import { Persona } from 'src/app/models/persona.model';
import { PersonaService } from 'src/app/services/persona.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-persona-table',
  templateUrl: './persona-table.component.html',
  styleUrls: ['./persona-table.component.css'],
})
export class PersonaTableComponent implements AfterViewInit {
  // Output que envia la persona seleccionada para editar, para cargar sus datos en el formulario
  @Output() editar = new EventEmitter<Persona>();
  // Paginador para la tabla
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'fullName',
    'identification',
    'age',
    'gender',
    'isActive',
    'drives',
    'usesGlasses',
    'isDiabetic',
    'otherDiseases',
    'aditionalData',
    'edit',
    'delete',
  ];

  dataSource = new MatTableDataSource<Persona>([]);
  personaSeleccionada?: Persona;

  constructor(
    private personaService: PersonaService,
    private dialog: MatDialog
  ) {}

  // Al iniciar el componente realizamos la carga del listado de clientes
  ngOnInit(): void {
    this.personaService.getPersonasActualizadas().subscribe(() => {
      this.cargarPersonas();
    });
  }

  // 
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  cargarPersonas() {
    this.personaService.getPersonas().subscribe((personas) => {
      this.dataSource.data = personas;
    });
  }

  // Funcion que al seleccionar que persona se quiere editar la emite para que la reciba el otro componente
  editarPersona(persona: Persona) {
    this.personaSeleccionada = persona;
    this.editar.emit({ ...persona });
  }

  // Funcion que abre el dialogo de confirmación para confirmar la acción de eliminar a un cliente
  confirmarEliminar(persona: Persona) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: `¿Seguro que quiere eliminar a ${persona.fullName}?`,
      },
    });

    // Si el resultado de la confirmación es true se procede a llamar al endpoint de eliminar y luego se recarga la tabla
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.personaService.deletePersona(persona.id).subscribe(() => {
          this.cargarPersonas();
        });
      }
    });
  }
}
