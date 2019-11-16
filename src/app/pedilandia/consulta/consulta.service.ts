import { Consulta, HorarioConsultaSelecao } from './consulta.model';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/common/api.service';

@Injectable({
    providedIn: 'root'
})
export class ConsultaService {
    defaultHorarios = ['7:00', '7:30', '8:00', '8:30', '9:00', '9:30', '10:00', 
    '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', 
    '14:30', '15:00', '15:30'];

    constructor(
        private api : ApiService
    ) { }

    async get() {        
        const res = await this.api.graphqlQuery(`
            query {
                consultas {
                _id
                dataConsulta
                dataRegistro
                paciente {
                    _id
                    nome
                    email
                    telefone
                    fotoUrl
                }
                tipoConsulta
                sintomasObservados
                medicamentosQueToma
                doencasRecentes
                informacoesAdicionais
                }
            }
        `);
        

        if(res.data && res.data.consultas) {
            return res.data.consultas;
        }
        
        return null;
    }

    async getResumoForListing () {
        const res = await this.api.graphqlQuery(`
            query {
                consultas {
                    _id
                    dataConsulta
                    paciente {
                        nome
                    }
                    tipoConsulta
                    realizada
                }
            }
        `);
        

        if(res.data && res.data.consultas) {
            return res.data.consultas;
        }

        return res.data;
        
    }
    
    async getDisponibilidadeHorarios (dia : string) : Promise<HorarioConsultaSelecao[]> {
        const res = await this.api.graphqlQuery(`
            query {
                horariosIndisponiveis(dia:"${dia}") 
            }
        `);
        

        if(res.data && res.data.horariosIndisponiveis) {
            const horariosIndisponiveis : string[] = res.data.horariosIndisponiveis.map(v => {
                const date = new Date(v);

                let hours : any = date.getHours();
                if(hours < 10)
                    hours = `0${hours}`;

                let minutes : any = date.getMinutes();
                if(minutes < 10)
                    minutes = `0${minutes}`;

                return `${ hours }:${ minutes }`
            });

            return this.defaultHorarios.map(v => {
                return new HorarioConsultaSelecao(v, !horariosIndisponiveis.includes(v))
            });
        }

        return [];
        
    }

    async insert ( consulta: Consulta ) {
        // const response = await this.api.graphqlMutation(`
        //     mutation {
        //         createConsulta (obj: {
        //             dataConsulta: "${consulta.dataConsulta}",
        //             paciente: {
        //                 _id: "${consulta.paciente._id}"
        //             },
        //             tipoConsulta : "${consulta.tipoConsulta}",
        //             sintomasObservados : "${consulta.sintomasObservados}",
        //             medicamentosQueToma : "${consulta.medicamentosQueToma}",
        //             doencasRecentes : "${consulta.doencasRecentes}",
        //             informacoesAdicionais : "${consulta.informacoesAdicionais}"
        //             }) {
        //             dataConsulta,
        //             _id
        //         }
        //     }
        // `);
            
        // return(response);
        return null;
    }

    
}
