import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Persona } from 'src/app/models/persona.model';
import { PersonaService } from 'src/app/services/persona.service';
import { ShowOnTouchedErrorStateMatcher } from './ErrorStateMatcher';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatChipEditedEvent } from '@angular/material/chips';

@Component({
  selector: 'app-persona-form',
  templateUrl: './persona-form.component.html',
  styleUrls: ['./persona-form.component.css'],
})
export class PersonaFormComponent {
  // Input para saber que persona se selecciona de la lista para modificar sus datos
  // Output para cuando se quiere cancelar la edicion de una persona
  @Input() personaSeleccionada?: Persona;
  @Output() limpiarSeleccion = new EventEmitter<void>();
  // Formulario para registrar los datos
  personaForm: FormGroup;
  // Matcher para manejar los errores
  matcher = new ShowOnTouchedErrorStateMatcher();
  // Lista de enfermedades a modo de array y separadores que se van a utilizar para ingresar los campos
  otherDiseasesList: string[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly addOnBlur = true;

  constructor(
    private formBuilder: FormBuilder,
    private personaService: PersonaService
  ) {
    this.personaForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]*$/)]],
      identification: [
        '',
        [
          Validators.required,
          Validators.min(0),
          Validators.minLength(8),
          Validators.maxLength(8),
        ],
      ],
      age: ['', [Validators.required, Validators.min(18)]],
      gender: ['', Validators.required],
      isActive: [true],
      drives: [false],
      usesGlasses: [false],
      isDiabetic: [false],
      otherDiseases: [''],
      aditionalData: [''],
    });
  }

  // Cuando se quiere agregar una enfermedad nueva se valida que el valor ingresado no exista ya en la lista, se agrega y se actualiza el formulario
  addDisease(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value && !this.otherDiseasesList.includes(value)) {
      this.otherDiseasesList.push(value);
      this.updateOtherDiseasesForm();
    }
    event.chipInput!.clear();
  }

  // Cuando se quiere remover una enfermedad de la lista, se busca el indice donde esta la enfermedad y se borra la enfermedad, luego se actualiza el formulario
  removeDisease(disease: string): void {
    const index = this.otherDiseasesList.indexOf(disease);
    if (index >= 0) {
      this.otherDiseasesList.splice(index, 1);
      this.updateOtherDiseasesForm();
    }
  }

  // Funcion para actualizar el formulario, utilizando comas para separar las enfermedades
  private updateOtherDiseasesForm() {
    this.personaForm.get('otherDiseases')?.setValue(this.otherDiseasesList.join(', '));
  }

  // Hook que detecta cambios en personaSeleccionada (seteada por la tabla para saber cual cliente editar)
  ngOnChanges(changes: SimpleChanges) {
    if (changes['personaSeleccionada'] && this.personaSeleccionada) {
      // Copiamos los datos de persona seleccionada dentro de formulario
      this.personaForm.patchValue(this.personaSeleccionada);
      // Guardamos en el array de manera limpia los datos de las enfermedades, si no hay datos se guarda el array vacio
      this.otherDiseasesList = this.personaSeleccionada.otherDiseases
        ? this.personaSeleccionada.otherDiseases
            .split(',')
            .map((e) => e.trim())
            .filter((e) => e)
        : [];
    }
  }

  // Funcion para guardar los datos de una persona ya sea nueva o ya creada
  guardarPersona() {
    // Guardamos en formValue los datos ingresados en el formulario
    const formValue = {
      ...this.personaForm.value,
      otherDiseases: this.otherDiseasesList.join(', '),
    };
    if (this.personaSeleccionada) {
      // Si era una persona ya creada se juntan los datos viejos y los nuevos, junto con el id que identifica cual es la persona a actualizar
      const personaActualizada = {
        ...this.personaSeleccionada,
        ...formValue,
        id: this.personaSeleccionada.id,
      };
      // Se llama al service para actualizar los datos de la persona
      this.personaService
        .updatePersona(this.personaSeleccionada.id!, personaActualizada)
        .subscribe(() => {
          // Notificamos al service que hubo una actualizacion en los valores para que actualice la tabla
          this.personaService.notificarPersonasActualizadas();
          // Limpiamos los campos y reseteamos el formulario
          this.personaSeleccionada = undefined;
          this.limpiarSeleccion.emit();
          this.resetForm();
        });
    } else {
      // Validamos que todos los campos sean correctos
      if (this.personaForm.invalid) {
        this.personaForm.markAllAsTouched();
        return;
      }
      // Creamos a la persona nueva, notificamos el cambio al service y limpiamos los campos
      this.personaService.createPersona(formValue).subscribe(() => {
        this.personaService.notificarPersonasActualizadas();
        this.limpiarSeleccion.emit();
        this.resetForm();
      });
    }
  }

  // Funcion para cancelar la edicion de una persona ya registrada
  cancelarEdicion() {
    this.personaSeleccionada = undefined;
    this.limpiarSeleccion.emit();
    this.resetForm();
  }

  // Funcion para limpiar el formulario y que no marque los errores
  resetForm() {
    this.personaForm.reset({
      fullName: '',
      identification: '',
      age: '',
      gender: '',
      isActive: true,
      drives: false,
      usesGlasses: false,
      isDiabetic: false,
      otherDiseases: '',
    });
    this.otherDiseasesList = [];
    this.personaForm.markAsPristine();
    this.personaForm.markAsUntouched();
  }
}
