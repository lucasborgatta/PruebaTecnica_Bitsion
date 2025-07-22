import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-persona-form',
  templateUrl: './persona-form.component.html',
  styleUrls: ['./persona-form.component.css']
})
export class PersonaFormComponent {
  personaForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.personaForm = this.fb.group({
      fullName: ['', Validators.required],
      identification: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18)]],
      gender: ['', Validators.required],
      hasDriverLicense: [false],
      isFitToDrive: [false],
      hasVisionProblems: [false],
      needsGlasses: [false],
      isDiabetic: [false],
      otherDiseases: ['']
    });
  }
}
