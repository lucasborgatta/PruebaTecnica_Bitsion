import { Component, EventEmitter, Output, ViewChild, AfterViewInit } from '@angular/core';
import { Persona } from 'src/app/models/persona.model';
import { PersonaService } from 'src/app/services/persona.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

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
  // Ordenador para los headers de la tabla
  @ViewChild(MatSort) sort!: MatSort;

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
  // Filtros aplicados
  filtros: any = {};

  // Variables para los filtros
  drivesTrue = false;
  drivesFalse = false;
  usesGlassesTrue = false;
  usesGlassesFalse = false;
  isDiabeticTrue = false;
  isDiabeticFalse = false;
  isActiveTrue = false;
  isActiveFalse = false;

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
    this.dataSource.sort = this.sort;
  }

  cargarPersonas() {
    this.personaService.getPersonas().subscribe((personas) => {
      this.dataSource.data = personas;
    });
  }

  aplicarFiltro() {
    this.personaService.filterPersonas(this.filtros).subscribe((personas) => {
      this.dataSource.data = personas;
    });
  }

  actualizarCheckboxFiltro(filtro: string) {
    switch (filtro) {
      case 'drives':
        if (this.drivesTrue && !this.drivesFalse) this.filtros.drives = true;
        else if (!this.drivesTrue && this.drivesFalse) this.filtros.drives = false;
        else delete this.filtros.drives;
        break;
      case 'usesGlasses':
        if (this.usesGlassesTrue && !this.usesGlassesFalse) this.filtros.usesGlasses = true;
        else if (!this.usesGlassesTrue && this.usesGlassesFalse) this.filtros.usesGlasses = false;
        else delete this.filtros.usesGlasses;
        break;
      case 'isDiabetic':
        if (this.isDiabeticTrue && !this.isDiabeticFalse) this.filtros.isDiabetic = true;
        else if (!this.isDiabeticTrue && this.isDiabeticFalse) this.filtros.isDiabetic = false;
        else delete this.filtros.isDiabetic;
        break;
      case 'isActive':
        if (this.isActiveTrue && !this.isActiveFalse) this.filtros.isActive = true;
        else if (!this.isActiveTrue && this.isActiveFalse) this.filtros.isActive = false;
        else delete this.filtros.isActive;
        break;
    }
  }

  limpiarFiltros() {
    this.filtros = {};
    this.drivesTrue = false;
    this.drivesFalse = false;
    this.usesGlassesTrue = false;
    this.usesGlassesFalse = false;
    this.isDiabeticTrue = false;
    this.isDiabeticFalse = false;
    this.isActiveTrue = false;
    this.isActiveFalse = false;
    this.cargarPersonas();
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
