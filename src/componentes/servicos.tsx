import React, { useEffect, useState } from "react";
import { ArrowLeftIcon, ListBulletIcon, ScissorsIcon, TrashIcon } from "@heroicons/react/24/solid";
import { listarServicos, atualizarServico, excluirServico } from "../api/servicos";

type Props = {
    tema: string;
    seletorView: (novaTela: string, evento: any) => void;
};

const Servicos: React.FC<Props> = ({ tema, seletorView }) => {
    const [servicos, setServicos] = useState<any[]>([]);
    const [filtroNome, setFiltroNome] = useState("");
    const [mostrarListagem, setMostrarListagem] = useState(false);
    const [mostrarAtualizar, setMostrarAtualizar] = useState(false);
    const [mostrarExcluir, setMostrarExcluir] = useState(false);

    const [nomeParaAtualizar, setNomeParaAtualizar] = useState("");
    const [servicosParaAtualizar, setServicosParaAtualizar] = useState<any[]>([]);
    const [servicoSelecionado, setServicoSelecionado] = useState<any>(null);
    const [novoNome, setNovoNome] = useState("");
    const [novoValor, setNovoValor] = useState("");
    const [sucesso, setSucesso] = useState<string | null>(null);
    const [erro, setErro] = useState<string | null>(null);

    const [nomeParaExcluir, setNomeParaExcluir] = useState("");
    const [servicosParaExcluir, setServicosParaExcluir] = useState<any[]>([]);
    const [servicoParaExcluir, setServicoParaExcluir] = useState<any>(null);
    const [sucessoExclusao, setSucessoExclusao] = useState<string | null>(null);
    const [erroExclusao, setErroExclusao] = useState<string | null>(null);
    const [excluindo, setExcluindo] = useState(false);

    useEffect(() => {
        listarServicos().then(setServicos).catch(console.error);
    }, []);

    useEffect(() => {
        if (mostrarAtualizar && nomeParaAtualizar.length > 0) {
            setServicosParaAtualizar(
                servicos.filter((s: any) =>
                    s.nome?.toLowerCase().includes(nomeParaAtualizar.toLowerCase())
                )
            );
        } else {
            setServicosParaAtualizar([]);
        }
    }, [nomeParaAtualizar, mostrarAtualizar, servicos]);

    useEffect(() => {
        if (mostrarExcluir && nomeParaExcluir.length > 0) {
            setServicosParaExcluir(
                servicos.filter((s: any) =>
                    s.nome?.toLowerCase().includes(nomeParaExcluir.toLowerCase())
                )
            );
        } else {
            setServicosParaExcluir([]);
        }
    }, [nomeParaExcluir, mostrarExcluir, servicos]);

    const handleAtualizarServico = async () => {
        try {
            await atualizarServico({
                id: servicoSelecionado.id,
                nome: novoNome,
                valor: parseFloat(novoValor)
            });
            setServicos(servicos.map(s =>
                s.id === servicoSelecionado.id
                    ? { ...s, nome: novoNome, valor: parseFloat(novoValor) }
                    : s
            ));
            setSucesso("Serviço atualizado com sucesso!");
            setTimeout(() => {
                setServicoSelecionado(null);
                setNovoNome("");
                setNovoValor("");
                setSucesso(null);
                setMostrarAtualizar(false);
            }, 1200);
        } catch (e) {
            setErro("Erro ao atualizar serviço.");
        }
    };

    const handleExcluirServico = async (servico: any) => {
        setExcluindo(true);
        setErroExclusao(null);
        setSucessoExclusao(null);
        try {
            await excluirServico(servico);
            setServicos(servicos.filter(s => s.id !== servico.id));
            setSucessoExclusao("Serviço excluído com sucesso!");
            setServicosParaExcluir(prev => prev.filter(s => s.id !== servico.id));
        } catch {
            setErroExclusao("Erro ao excluir serviço.");
        }
        setExcluindo(false);
    };

    return (
        <>
            <div className="flex w-full p-4 bg-[#dba2eb]">
                <button
                    className="flex p-4 items-center text-xl hover:bg-purple-600 transition rounded-xl"
                    onClick={(e) => seletorView('Home', e)}
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                    Voltar
                </button>
            </div>
            <div className="flex flex-wrap p-4 gap-5 justify-center bg-[#dba2eb]">
                <button
                    className="flex flex-col justify-center items-center px-4 py-2 rounded h-52 w-full max-w-xs hover:bg-purple-600 transition bg-[#d07af0]"
                    onClick={() => {
                        setMostrarAtualizar(true);
                        setMostrarExcluir(false);
                        setMostrarListagem(false);
                    }}
                >
                    <ScissorsIcon className="h-16 w-16 mb-4" />
                    Atualizar Serviço
                </button>
                <button
                    className="flex flex-col justify-center items-center px-4 py-2 rounded h-52 w-full max-w-xs hover:bg-purple-600 transition bg-[#c35de8]"
                    onClick={() => {
                        setMostrarExcluir(true);
                        setMostrarAtualizar(false);
                        setMostrarListagem(false);
                    }}
                >
                    <TrashIcon className="h-16 w-16 mb-4" />
                    Excluir Serviço
                </button>
                <button
                    className="flex flex-col justify-center items-center px-4 py-2 rounded h-52 w-full max-w-xs hover:bg-purple-600 transition bg-[#b358e8]"
                    onClick={() => {
                        setMostrarListagem(true);
                        setMostrarAtualizar(false);
                        setMostrarExcluir(false);
                    }}
                >
                    <ListBulletIcon className="h-16 w-16 mb-4" />
                    Listagem
                </button>
            </div>

            {mostrarAtualizar && (
                <div className="flex flex-col gap-4 bg-purple-400 p-4 rounded shadow mx-7 my-4">
                    {!servicoSelecionado ? (
                        <>
                            <h2 className="text-xl font-bold">Digite o nome do serviço para atualizar:</h2>
                            <input
                                type="text"
                                placeholder="Pesquisar por nome..."
                                value={nomeParaAtualizar}
                                onChange={e => setNomeParaAtualizar(e.target.value)}
                                className="px-3 py-2 max-w-80 rounded border border-gray-300"
                            />
                            <ul className="divide-y divide-gray-200 max-h-40 overflow-y-auto">
                                {servicosParaAtualizar.map((servico, idx) => (
                                    <li key={servico.id || idx} className="py-2 flex justify-between items-center">
                                        <span>
                                            {servico.nome} (R$ {servico.valor}) (id: {servico.id})
                                        </span>
                                        <button
                                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            onClick={() => {
                                                setServicoSelecionado(servico);
                                                setNovoNome(servico.nome);
                                                setNovoValor(servico.valor?.toString() || "");
                                            }}
                                        >
                                            Selecionar
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <>
                            <h2 className="text-xl font-bold">Atualizar Serviço</h2>
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                Novo Nome
                            </label>
                            <input
                                className="appearance-none block w-full bg-gray-400 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none"
                                type="text"
                                value={novoNome}
                                onChange={e => setNovoNome(e.target.value)}
                            />
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                Novo Valor
                            </label>
                            <input
                                className="appearance-none block w-full bg-gray-400 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none"
                                type="number"
                                step="0.01"
                                value={novoValor}
                                onChange={e => setNovoValor(e.target.value)}
                            />
                            {erro && <div className="text-red-500">{erro}</div>}
                            {sucesso && <div className="text-green-600">{sucesso}</div>}
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setServicoSelecionado(null);
                                        setNovoNome("");
                                        setNovoValor("");
                                        setErro(null);
                                        setSucesso(null);
                                    }}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                    type="button"
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                                    type="button"
                                    onClick={handleAtualizarServico}
                                >
                                    Salvar
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {mostrarExcluir && (
                <div className="flex flex-col gap-4 bg-purple-400 p-4 rounded shadow mx-7 my-4">
                    <h2 className="text-xl font-bold">Informe o nome do serviço para excluir:</h2>
                    <input
                        type="text"
                        placeholder="Pesquisar por nome..."
                        value={nomeParaExcluir}
                        onChange={e => setNomeParaExcluir(e.target.value)}
                        className="px-3 py-2 max-w-80 rounded border border-gray-300"
                    />
                    <ul className="divide-y divide-gray-200 max-h-40 overflow-y-auto">
                        {servicosParaExcluir.map((servico, idx) => (
                            <li key={servico.id || idx} className="py-2 flex justify-between items-center">
                                <span>
                                    {servico.nome} (R$ {servico.valor}) (id: {servico.id})
                                </span>
                                <button
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    disabled={excluindo}
                                    onClick={() => handleExcluirServico(servico)}
                                >
                                    Excluir
                                </button>
                            </li>
                        ))}
                    </ul>
                    {erroExclusao && <div className="text-red-500">{erroExclusao}</div>}
                    {sucessoExclusao && <div className="text-green-600">{sucessoExclusao}</div>}
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => {
                                setNomeParaExcluir("");
                                setServicosParaExcluir([]);
                                setErroExclusao(null);
                                setSucessoExclusao(null);
                                setMostrarExcluir(false);
                            }}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}

            {mostrarListagem && (
                <div className="p-4 bg-purple-400 rounded shadow mx-7 my-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-2">
                        <h2 className="text-lg font-bold">Serviços cadastrados</h2>
                        <input
                            type="text"
                            placeholder="Pesquisar por nome..."
                            value={filtroNome}
                            onChange={e => setFiltroNome(e.target.value)}
                            className="px-3 py-2 rounded w-full md:w-72 border border-gray-300"
                        />
                    </div>
                    <ul className="divide-y divide-gray-200">
                        {servicos
                            .filter(servico =>
                                servico.nome?.toLowerCase().includes(filtroNome.toLowerCase())
                            )
                            .map((servico, index) => (
                                <li key={servico.id || index} className="py-2">
                                    <span className="font-semibold ml-2">{servico.nome}</span>
                                    <span className="ml-2">R$ {servico.valor}</span>
                                    <span className="ml-2 text-gray-500">id: {servico.id}</span>
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default Servicos;