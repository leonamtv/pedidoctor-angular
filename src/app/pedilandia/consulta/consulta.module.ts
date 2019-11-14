import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CadastroConsultaComponent } from './cadastro-consulta/cadastro-consulta.component';
import { TextMaskModule } from 'angular2-text-mask';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { ListagemConsultaComponent } from './listagem-consulta/listagem-consulta.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    CadastroConsultaComponent,
    ListagemConsultaComponent
  ],
  providers:[
    {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},
  ],
  imports: [
    CommonModule,
    MatInputModule,
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatProgressBarModule,
    MatTableModule,
    MatStepperModule,
    MatTabsModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    TextMaskModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  exports: [
    CadastroConsultaComponent
  ]
})
export class ConsultaModule { }
