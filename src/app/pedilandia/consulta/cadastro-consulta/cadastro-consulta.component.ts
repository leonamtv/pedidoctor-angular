import { AuthService } from 'src/app/common/security/auth.service';
import { TipoConsulta } from './../../util/tipo-consulta.enum';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Consulta } from './../consulta.model';
import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../common/security/usuario.model';
import { ConsultaService } from '../consulta.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackService } from 'src/app/common/utils/snack/snack.service';
import { MatChipInputEvent } from '@angular/material';
import { ClinicaService } from '../../clinica/clinica.service';
import { MedicoService } from '../../medico/medico.service';
import { Medico } from '../../medico/medico.model';
import { ConsultaTipoService } from '../../consulta-tipo/consulta-tipo.service';

@Component({
    selector: 'app-cadastro-consulta',
    templateUrl: './cadastro-consulta.component.html',
    styleUrls: ['./cadastro-consulta.component.scss']
})
export class CadastroConsultaComponent implements OnInit{

    private visible = true;
    private selectable = true;
    private removable = true;
    private addOnBlur = true;

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    private consulta: Consulta;

    private hora_consulta   : string;
    private nome_clinica    : string;
    private nome_medico     : string;

    private primeiro_form_group : FormGroup;
    private segundo_form_group  : FormGroup;
    private terceiro_form_group : FormGroup;
    private quarto_form_group   : FormGroup;

    private horarios_disponiveis: string[];
    private options             : string[];
    private clinicas            : any[];
    private medicos             : any[];

    private sintomas_selected       : any[];
    private medicamentos_selected   : any[]
    private doencas_selected        : any[]
    private tipoConsultaOptions     : any[];
    
    constructor (
        private form_builder        : FormBuilder,
        private authService         : AuthService,
        private service             : ConsultaService,
        private clinica_service     : ClinicaService,
        private consultaT_service   : ConsultaTipoService,
        private medico_service      : MedicoService,
        private router              : Router,
        private snack_bar_service   : SnackService
    ) { }

    ngOnInit(){ 

        this.consulta = new Consulta();

        this.tipoConsultaOptions = [];
        this.medicos = [];
        this.clinicas = [];

        this.options = ['7:00', '7:30', '8:00', '8:30', '9:00', '9:30', '10:00', 
                        '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', 
                        '14:30', '15:00', '15:30'];

        this.clinica_service.findAll().then((clinicas: any[]) => {
            this.clinicas = clinicas;
        })

        this.medico_service.findAll().then((medicos: any[]) => {
            this.medicos = medicos;
        })

        this.consultaT_service.findAll().then((consultasT: any[]) => {
            this.tipoConsultaOptions = consultasT.map((consT) => {
                return {
                    label : consT.nome,
                    value : consT.nome,
                    content : consT
                }
            })
        })

        this.quarto_form_group = this.form_builder.group({
            medicamentosQueToma: [
                this.consulta.medicamentosQueToma
            ],
            doencasRecentes: [
                this.consulta.doencasRecentes
            ],
            informacoesAdicionais: [
                this.consulta.informacoesAdicionais
            ]
        });

        this.terceiro_form_group = this.form_builder.group({
            tipoConsulta: [
                this.consulta.tipoConsulta.nome,
                [
                    Validators.required
                ]
            ],
            sintomasObservados: [
                this.consulta.sintomasObservados
            ]
        });

        this.segundo_form_group = this.form_builder.group({
            data: [
                this.consulta.dataConsulta,
                [
                    Validators.required
                ]
            ],
            horario: [
                this.hora_consulta,
                [
                    Validators.required
                ]
            ]
        });

        this.primeiro_form_group = this.form_builder.group({
            clinica: [
                this.consulta.clinica.nome,
                [
                    Validators.required,
                    Validators.minLength(1)
                ]
            ],
            medico: [
                this.consulta.medico.nome,
                [
                    Validators.required,
                    Validators.minLength(1)
                ]
            ]
        })

        this.hora_consulta = null;

        this.sintomas_selected = [];
        this.medicamentos_selected = [];
        this.doencas_selected = [];

    }

    private date_change() {
        if ( this.segundo_form_group.get('data').valid ) {
            this.segundo_form_group.get('horario').enable();
            // Preencher horarios disponiveis
        } else {
            this.segundo_form_group.get('horario').disable();
        }

    }

    private check_medico_clinica() {
        if ( this.primeiro_form_group.get('clinica').valid ) {
            this.primeiro_form_group.get('medico').enable();
            // Preencher médicos disponíveis
        } else {
            this.primeiro_form_group.get('medico').disable();
        }
    }

    public add_sintoma(event: MatChipInputEvent) {
        const input = event.input;
        const value = event.value;

        if ((value || '').trim()) {
            this.sintomas_selected.push({ name : value.trim() })
        }

        if ( input ) {
            input.value = '';
        }

        this.terceiro_form_group.patchValue({
            sintomasObservados : this.sintomas_selected
        })
    }

    public remove_sintomas(sintoma) {
        const index = this.sintomas_selected.indexOf(sintoma);
        
        if ( index >= 0 ) {
            this.sintomas_selected.splice(index, 1);
        }

        this.terceiro_form_group.patchValue({
            sintomasObservados : this.sintomas_selected
        })
    }

    public add_medicamento(event: MatChipInputEvent) {
        const input = event.input;
        const value = event.value;

        if ((value || '').trim()) {
            this.medicamentos_selected.push({ name : value.trim() })
        }

        if ( input ) {
            input.value = '';
        }

        this.quarto_form_group.patchValue({
            medicamentosQueToma : this.medicamentos_selected
        });

    }

    public remove_medicamentos(medicamento) {
        const index = this.medicamentos_selected.indexOf(medicamento);
        
        if ( index >= 0 ) {
            this.medicamentos_selected.splice(index, 1);
        }

        this.quarto_form_group.patchValue({
            medicamentosQueToma : this.medicamentos_selected
        });
    }

    public add_doenca(event: MatChipInputEvent) {
        const input = event.input;
        const value = event.value;

        if ((value || '').trim()) {
            this.doencas_selected.push({ name : value.trim() })
        }

        if ( input ) {
            input.value = '';
        }

        this.quarto_form_group.patchValue({
            doencasRecentes : this.doencas_selected
        });
    }

    public remove_doencas(doenca) {
        const index = this.doencas_selected.indexOf(doenca);
        
        if ( index >= 0 ) {
            this.doencas_selected.splice(index, 1);
        }

        this.quarto_form_group.patchValue({
            doencasRecentes : this.doencas_selected
        });
    }

    get medico () {
        if ( this.medicos.length > 0 ) {
            return this.medicos.filter(medico => {
                return medico.nome == this.primeiro_form_group.get('medico').value;
            })[0]
        } else 
            return null
    }

    get clinica () {
        if ( this.clinicas.length > 0 ) {
            return this.clinicas.filter(clinica => {
                return clinica.nome == this.primeiro_form_group.get('clinica').value;
            })[0]
        } else 
            return null
    }

    get data () {
        return this.segundo_form_group.get('data').value;
    }

    get horario () {
        return this.segundo_form_group.get('horario').value;
    }

    get tipoConsulta () {
        if ( this.tipoConsultaOptions.length > 0 ) {
            let tipo =  this.tipoConsultaOptions.filter(tpCons => {
                return tpCons.label == this.terceiro_form_group.get('tipoConsulta').value;
            })[0]
            if (tipo) {
                return tipo.content;
            } else 
                return null;
        } else 
            return null
    }

    get sintomasObservados () {
        return ( this.terceiro_form_group.get('sintomasObservados').value == null ) ? [] : this.terceiro_form_group.get('sintomasObservados').value;
    }

    get medicamentosQueToma () {
        return  ( this.quarto_form_group.get('medicamentosQueToma').value == null) ? [] : this.quarto_form_group.get('medicamentosQueToma').value ;
    }

    get doencasRecentes () {
        return ( this.quarto_form_group.get('doencasRecentes').value == null ) ? [] : this.quarto_form_group.get('doencasRecentes').value;
    }

    get informacoesAdicionais () {
        return this.quarto_form_group.get('informacoesAdicionais').value;
    }

    salvar () {
        
        let h = /([0-9]+(?=:))/g.exec(this.horario);
        let m = /(?<=:)([0-9]+)/g.exec(this.horario);

        let user = this.authService.usuarioLogado.value.usuario;

        let consulta_cadastrada = new Consulta(
            new Date(),
            new Date(),
            new Usuario({
                _id         : user._id,
                nome        : user.nome,
                email       : user.email,
                fotoUrl     : user.fotoUrl,
                jwt         : null,
                telefone    : user.telefone,
                tipo        : 0,
                qtConsultas : 0 }),
            this.tipoConsulta,
            this.sintomas_selected,
            this.medicamentos_selected,
            this.doencas_selected,
            this.informacoesAdicionais,
            this.clinica,
            this.medico
        );

        consulta_cadastrada.dataConsulta.setHours(Number(h[0]), Number(m[0]), 0)

        this.service.insert(consulta_cadastrada).then((data) => {
            this.snack_bar_service.open_snack_bar('Consulta agendada', 'success');
            this.primeiro_form_group.reset();
            this.segundo_form_group.reset();
            this.terceiro_form_group.reset();
            this.quarto_form_group.reset();
        }).catch(error => {
            this.snack_bar_service.open_snack_bar( 'Consulta não agendada. Algum erro ocorreu', 'danger' );
        })

    }

    navigate_back() {
        this.router.navigate([ '/pedilandia/consulta' ]);
    }

}
