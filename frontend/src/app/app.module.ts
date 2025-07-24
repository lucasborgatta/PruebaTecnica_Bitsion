import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { PersonaFormComponent } from './components/persona-form/persona-form.component';
import { PersonaTableComponent } from './components/persona-table/persona-table.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MaterialModule } from './material.module';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { AuthGuard } from './guard/auth.guard';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    PersonaFormComponent,
    PersonaTableComponent,
    LoginComponent,
    RegisterComponent,
    ConfirmDialogComponent,
    MainLayoutComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    AppRoutingModule
],
  providers: [AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
