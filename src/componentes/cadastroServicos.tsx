import React, { useState } from "react";
import { cadastrarServico } from "../api/servicos";

const CadastroServico = ({ onClose }: { onClose: () => void }) => {
    const [nome, setNome] = useState("");
    const [valor, setValor] = useState("");
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro("");
        setSucesso("");
        if (!nome.trim() || !valor.trim()) {
            setErro("Nome e valor são obrigatórios.");
            return;
        }
        try {
            await cadastrarServico({ nome, valor: parseFloat(valor) });
            setSucesso("Serviço cadastrado com sucesso!");
            setNome(""); setValor("");
            setTimeout(() => {
                setSucesso("");
                onClose();
            }, 1200);
        } catch (err) {
            setErro("Erro ao cadastrar serviço");
        }
    };

    return (
        <form className="w-full max-w-lg bg-white p-8 rounded shadow" onSubmit={handleSubmit}>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="servico_nome">
                        Nome
                    </label>
                    <input value={nome} onChange={e => setNome(e.target.value)} className="appearance-none block w-full bg-gray-400 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none" id="servico_nome" type="text" />
                </div>
                <div className="w-full md:w-1/2 px-3">
                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="servico_valor">
                        Valor
                    </label>
                    <input value={valor} onChange={e => setValor(e.target.value)} className="appearance-none block w-full bg-gray-400 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none" id="servico_valor" type="number" step="0.01" />
                </div>
            </div>
            {erro && <div className="text-red-500">{erro}</div>}
            {sucesso && <div className="text-green-600">{sucesso}</div>}
            <div className="flex items-center justify-between mt-4">
                <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                    Finalizar Cadastro
                </button>
                <button type="button" className="bg-gray-300 px-4 py-2 rounded ml-2" onClick={onClose}>
                    Fechar
                </button>
            </div>
        </form>
    );
};

export default CadastroServico;