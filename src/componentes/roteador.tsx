import React, { useState } from "react";
import BarraNavegacao from "./barraNavegacao";
import FormularioCadastro from "./formularioCadastro";
import PaginaPrincipal from "./home";
import Clientes from "./clientes";
import Produtos from "./produtos";
import Servicos from "./servicos";
import ListagensEspeciais from "./listagensEspeciais";

const Roteador: React.FC = () => {
    const [tela, setTela] = useState('Home');

    const selecionarView = (novaTela: string, evento: any) => {
        evento.preventDefault();
        setTela(novaTela);
    };

    let barraNavegacao = <BarraNavegacao seletorView={selecionarView} tema="purple lighten-4" botoes={['Home', 'Cadastros']} />;

    if (tela === 'Home') {
        return (
            <>
                {barraNavegacao}
                <PaginaPrincipal tema="purple lighten-4" seletorView={selecionarView} />
            </>
        );
    } else if (tela === 'Clientes') {
        return (
            <>
                {barraNavegacao}
                <Clientes tema="purple lighten-4" seletorView={selecionarView} />
            </>
        );
    } else if (tela === 'Produtos') {
        return (
            <>
                {barraNavegacao}
                <Produtos tema="purple lighten-4" seletorView={selecionarView} />
            </>
        );
    } else if (tela === 'Servicos') {
        return (
            <>
                {barraNavegacao}
                <Servicos tema="purple lighten-4" seletorView={selecionarView} />
            </>
        );
    } else if (tela === 'ListagensEspeciais') {
        return (
            <>
                {barraNavegacao}
                <ListagensEspeciais tema="purple lighten-4" seletorView={selecionarView} />
            </>
        );
    } else {
        return (
            <>
                {barraNavegacao}
                <FormularioCadastro tema="purple lighten-4" seletorView={selecionarView} />
            </>
        );
    }
};

export default Roteador;