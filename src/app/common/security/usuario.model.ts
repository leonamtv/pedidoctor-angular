export class Usuario {

    _id: string;
    nome: string;
    email: string;
    jwt: string;
    fotoUrl: string;
    telefone: string;

    constructor(params : {
        nome: string,
        email: string,
        jwt: string,
        fotoUrl: string,
        telefone: string,
    }) {
        Object.assign(this, params);
    }
}