import { ArrowLeftIcon, ListBulletIcon, UserCircleIcon, UserMinusIcon } from "@heroicons/react/24/solid"
import React, { useEffect, useState } from "react"
import Modal from "./Modal"
import { listarClientes, excluirCliente, atualizarCliente, buscarMaioresConsumidores, BuscarMenoresConsumidores, BuscarTop5Valor } from "../api/clientes"
import { listarProdutos, atualizarProdutosAssociados } from "../api/produtos"
import { listarServicos, atualizarServicosAssociados } from "../api/servicos"
import { supabase } from "../api/supabaseClient"

type Props = {
    tema: string
    seletorView: (novaTela: string, evento: any) => void
}

const Clientes: React.FC<Props> = ({ tema, seletorView }) => {
    const [mostrarListagens, setMostrarListagens] = useState(false);
    const [mostrarListaClientes, setMostrarListaClientes] = useState(false)
    const [atualizandoCliente, setAtualizandoCliente] = useState(false);
    const [modalAberto, setModalAberto] = useState(false);
    const [modalConteudo, setModalConteudo] = useState<React.ReactNode>(null);
    const [clientes, setClientes] = useState<any[]>([]);
    const [filtroNome, setFiltroNome] = useState(""); 
    const [nomeParaExcluir, setNomeParaExcluir] = useState("");
    const [clientesParaExcluir, setClientesParaExcluir] = useState<any[]>([]);
    const [excluindo, setExcluindo] = useState(false);
    const [erroExclusao, setErroExclusao] = useState<string | null>(null);
    const [sucessoExclusao, setSucessoExclusao] = useState<string | null>(null);
    const [mostrarExcluirCliente, setMostrarExcluirCliente] = useState(false);
    const [nomeParaAtualizar, setNomeParaAtualizar] = useState("");
    const [clientesParaAtualizar, setClientesParaAtualizar] = useState<any[]>([]);
    const [clienteSelecionado, setClienteSelecionado] = useState<any>(null);
    const [campoAtualizar, setCampoAtualizar] = useState<string | null>(null);
    const [novoValor, setNovoValor] = useState("");
    const [novoTelefone, setNovoTelefone] = useState({ ddd: "", numero: "" });
    const [telefoneEditando, setTelefoneEditando] = useState<number | null>(null);
    const [campoEndereco, setCampoEndereco] = useState<string | null>(null);
    const [mostrarListagemGenero, setMostrarListagemGenero] = useState(false);
    const [generoSelecionado, setGeneroSelecionado] = useState<"masculino" | "feminino" | "">("");

    const [todosProdutos, setTodosProdutos] = useState<any[]>([]);
    const [todosServicos, setTodosServicos] = useState<any[]>([]);
    const [produtosSelecionados, setProdutosSelecionados] = useState<number[]>([]);
    const [servicosSelecionados, setServicosSelecionados] = useState<number[]>([]);
    const [mostrarMaioresConsumidores, setMostrarMaioresConsumidores] = useState(false);
    const [maioresConsumidores, setMaioresConsumidores] = useState<any[]>([]);
    const [mostrarMenoresConsumidores, setMostrarMenoresConsumidores] = useState(false);
    const [menoresConsumidores, setMenoresConsumidores] = useState<any[]>([]);
    const [mostrarTop5Valor, setMostrarTop5Valor] = useState(false);
    const [top5Valor, setTop5Valor] = useState<any[]>([]);

    useEffect(() => {
        listarClientes().then(setClientes).catch(console.error)
    }, [])

    const fecharModal = () => {
        setModalAberto(false);
        setModalConteudo(null);
    };

    const handleListagensClick = () => {
        setMostrarListagens((prev) => !prev);
        setAtualizandoCliente(false);
        setMostrarListaClientes(false);
        setMostrarExcluirCliente(false); 
    };

    const handleAtualizarClienteClick = () => {
        setAtualizandoCliente((prev) => !prev);
        setMostrarListagens(false);
        setMostrarListaClientes(false);
        setMostrarExcluirCliente(false);
    };

    const buscarClientesParaExcluir = async (nome: string) => {
        try {
            const todos = await listarClientes();
            setClientesParaExcluir(
                todos.filter((c: any) =>
                    c.nome?.toLowerCase().includes(nome.toLowerCase())
                )
            );
        } catch (e) {
            setClientesParaExcluir([]);
        }
    };

    useEffect(() => {
        if (mostrarExcluirCliente && nomeParaExcluir.length > 0) {
            buscarClientesParaExcluir(nomeParaExcluir);
        } else {
            setClientesParaExcluir([]);
        }
    }, [nomeParaExcluir, mostrarExcluirCliente]);

    const buscarClientesParaAtualizar = async (nome: string) => {
        try {
            const todos = await listarClientes();
            setClientesParaAtualizar(
                todos.filter((c: any) =>
                    c.nome?.toLowerCase().includes(nome.toLowerCase())
                )
            );
        } catch (e) {
            setClientesParaAtualizar([]);
        }
    };

    useEffect(() => {
        if (atualizandoCliente && nomeParaAtualizar.length > 0) {
            buscarClientesParaAtualizar(nomeParaAtualizar);
        } else {
            setClientesParaAtualizar([]);
        }
    }, [nomeParaAtualizar, atualizandoCliente]);

    useEffect(() => {
        if (campoAtualizar === "produtosAssociados") {
            listarProdutos().then(setTodosProdutos);
            supabase.from("produtos_consumidos").select("produto_id").eq("cliente_id", clienteSelecionado.id)
                .then(({ data }) => setProdutosSelecionados(data ? data.map((d: any) => d.produto_id) : []));
        }
        if (campoAtualizar === "servicosAssociados") {
            listarServicos().then(setTodosServicos);
            supabase.from("servicos_consumidos").select("servico_id").eq("cliente_id", clienteSelecionado.id)
                .then(({ data }) => setServicosSelecionados(data ? data.map((d: any) => d.servico_id) : []));
        }
    }, [campoAtualizar, clienteSelecionado]);

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
                    onClick={handleAtualizarClienteClick}
                >
                    <UserCircleIcon className="h-16 w-16 mb-4" />
                    Atualizar Cliente
                </button>
                <button
                    className="flex flex-col justify-center items-center px-4 py-2 rounded h-52 w-full max-w-xs hover:bg-purple-600 transition bg-[#c35de8]"
                    onClick={() => {
                        setMostrarExcluirCliente(true);
                        setMostrarListagens(false);
                        setAtualizandoCliente(false);
                        setMostrarListaClientes(false);
                        setMostrarListagemGenero(false)
                    }}
                >
                    <UserMinusIcon className="h-16 w-16 mb-4" />
                    Excluir Cliente
                </button>
                <button
                    className="flex flex-col justify-center items-center px-4 py-2 rounded h-52 w-full max-w-xs hover:bg-purple-600 transition bg-[#b358e8]"
                    onClick={handleListagensClick}
                >
                    <ListBulletIcon className="h-16 w-16 mb-4" />
                    Listagens
                </button>
            </div>

            {atualizandoCliente && (
                <div className="flex flex-col gap-4 bg-purple-400 p-4 rounded shadow mx-7 my-4">
                    {!clienteSelecionado ? (
                        <>
                            <h2 className="text-xl font-bold">Digite o nome do cliente para atualizar:</h2>
                            <input
                                type="text"
                                placeholder="Pesquisar por nome..."
                                value={nomeParaAtualizar}
                                onChange={e => setNomeParaAtualizar(e.target.value)}
                                className="px-3 py-2 max-w-80 rounded border border-gray-300"
                            />
                            <ul className="divide-y divide-gray-200 max-h-40 overflow-y-auto">
                                {clientesParaAtualizar.map((cliente, idx) => (
                                    <li key={cliente.id || idx} className="py-2 flex justify-between items-center">
                                        <span>
                                            {cliente.nome} {cliente.sobrenome && cliente.sobrenome} (id: {cliente.id})
                                        </span>
                                        <button
                                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            onClick={() => setClienteSelecionado(cliente)}
                                        >
                                            Selecionar
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : !campoAtualizar ? (
                        <>
                            <h2 className="text-xl font-bold">O que deseja atualizar?</h2>
                            <div className="flex flex-wrap gap-2">
                                <button className="bg-purple-600 text-white px-3 py-1 rounded" onClick={() => setCampoAtualizar("nome")}>Nome</button>
                                <button className="bg-purple-600 text-white px-3 py-1 rounded" onClick={() => setCampoAtualizar("sobrenome")}>Sobrenome</button>
                                <button className="bg-purple-600 text-white px-3 py-1 rounded" onClick={() => setCampoAtualizar("genero")}>Gênero</button>
                                <button className="bg-purple-600 text-white px-3 py-1 rounded" onClick={() => setCampoAtualizar("email")}>Email</button>
                                <button className="bg-purple-600 text-white px-3 py-1 rounded" onClick={() => setCampoAtualizar("endereco")}>Endereço</button>
                                <button className="bg-purple-600 text-white px-3 py-1 rounded" onClick={() => setCampoAtualizar("telefones")}>Telefones</button>
                                <button className="bg-purple-600 text-white px-3 py-1 rounded" onClick={() => setCampoAtualizar("produtosAssociados")}>Produtos associados</button>
                                <button className="bg-purple-600 text-white px-3 py-1 rounded" onClick={() => setCampoAtualizar("servicosAssociados")}>Serviços Associados</button>
                            </div>
                            <button className="mt-2 px-3 py-1 bg-gray-300 rounded" onClick={() => setClienteSelecionado(null)}>Voltar</button>
                        </>
                    ) : campoAtualizar === "telefones" ? (
                        <>
                            <h2 className="text-xl font-bold">Telefones</h2>
                            <ul>
                                {clienteSelecionado.telefones.map((tel: any, idx: number) => (
                                    <li key={idx} className="flex items-center gap-2">
                                        {telefoneEditando === idx ? (
                                            <>
                                                <input
                                                    type="text"
                                                    placeholder="DDD"
                                                    value={novoTelefone.ddd}
                                                    onChange={e => setNovoTelefone({ ...novoTelefone, ddd: e.target.value })}
                                                    className="w-16 px-1 py-1 rounded border"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Número"
                                                    value={novoTelefone.numero}
                                                    onChange={e => setNovoTelefone({ ...novoTelefone, numero: e.target.value })}
                                                    className="w-24 px-1 py-1 rounded border"
                                                />
                                                <button
                                                    className="bg-purple-500 text-white hover:bg-purple-600 px-2 py-1 rounded"
                                                    onClick={async () => {
                                                        const atualizado = { ...clienteSelecionado };
                                                        atualizado.telefones[idx] = { ...novoTelefone };
                                                        await atualizarCliente(atualizado);
                                                        setClienteSelecionado(atualizado);
                                                        setTelefoneEditando(null);
                                                        setNovoTelefone({ ddd: "", numero: "" });
                                                    }}
                                                >Salvar</button>
                                                <button className="bg-gray-300 px-2 py-1 rounded" onClick={() => setTelefoneEditando(null)}>Cancelar</button>
                                            </>
                                        ) : (
                                            <>
                                                <span>({tel.ddd}) {tel.numero}</span>
                                                <button className="bg-blue-500 text-white px-2 py-1 rounded"
                                                    onClick={() => {
                                                        setTelefoneEditando(idx);
                                                        setNovoTelefone({ ddd: tel.ddd, numero: tel.numero });
                                                    }}
                                                >Editar</button>
                                                <button className="bg-red-500 text-white px-2 py-1 rounded"
                                                    onClick={async () => {
                                                        const atualizado = { ...clienteSelecionado };
                                                        atualizado.telefones = atualizado.telefones.filter((_: any, i: number) => i !== idx);
                                                        await atualizarCliente(atualizado);
                                                        setClienteSelecionado(atualizado);
                                                    }}
                                                >Excluir</button>
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            <div className="flex items-center gap-2 mt-2">
                                <input
                                    type="text"
                                    placeholder="DDD"
                                    value={novoTelefone.ddd}
                                    onChange={e => setNovoTelefone({ ...novoTelefone, ddd: e.target.value })}
                                    className="w-16 px-1 py-1 rounded border"
                                />
                                <input
                                    type="text"
                                    placeholder="Número"
                                    value={novoTelefone.numero}
                                    onChange={e => setNovoTelefone({ ...novoTelefone, numero: e.target.value })}
                                    className="w-24 px-1 py-1 rounded border"
                                />
                                <button
                                    className="bg-green-500 text-white px-2 py-1 rounded"
                                    onClick={async () => {
                                        if (!novoTelefone.ddd || !novoTelefone.numero) return;
                                        const atualizado = { ...clienteSelecionado };
                                        atualizado.telefones = [...atualizado.telefones, { ...novoTelefone }];
                                        await atualizarCliente(atualizado);
                                        setClienteSelecionado(atualizado);
                                        setNovoTelefone({ ddd: "", numero: "" });
                                    }}
                                >Adicionar</button>
                            </div>
                            <button className="mt-2 px-3 py-1 bg-gray-300 rounded" onClick={() => setCampoAtualizar(null)}>Voltar</button>
                        </>
                    ) : campoAtualizar === "endereco" ? (
                        <>
                            {!campoEndereco ? (
                                <>
                                    <h2 className="text-xl font-bold">Qual campo do endereço deseja atualizar?</h2>
                                    <div className="flex flex-wrap gap-2">
                                        <button className="bg-purple-600 text-white px-3 py-1 rounded" onClick={() => setCampoEndereco("estado")}>Estado</button>
                                        <button className="bg-purple-600 text-white px-3 py-1 rounded" onClick={() => setCampoEndereco("cidade")}>Cidade</button>
                                        <button className="bg-purple-600 text-white px-3 py-1 rounded" onClick={() => setCampoEndereco("bairro")}>Bairro</button>
                                        <button className="bg-purple-600 text-white px-3 py-1 rounded" onClick={() => setCampoEndereco("rua")}>Rua</button>
                                        <button className="bg-purple-600 text-white px-3 py-1 rounded" onClick={() => setCampoEndereco("numero")}>Número</button>
                                        <button className="bg-purple-600 text-white px-3 py-1 rounded" onClick={() => setCampoEndereco("codigoPostal")}>CEP</button>
                                        <button className="bg-purple-600 text-white px-3 py-1 rounded" onClick={() => setCampoEndereco("informacoesAdicionais")}>Informações Adicionais</button>
                                    </div>
                                    <button className="mt-2 px-3 py-1 bg-gray-300 rounded" onClick={() => setCampoAtualizar(null)}>Voltar</button>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-xl font-bold">Novo valor para {campoEndereco}:</h2>
                                    <input
                                        type="text"
                                        value={novoValor}
                                        onChange={e => setNovoValor(e.target.value)}
                                        className="px-3 py-2 max-w-80 rounded border border-gray-300"
                                    />
                                    <button
                                        className="bg-purple-500 text-white hover:bg-purple-600 px-3 py-1 rounded"
                                        onClick={async () => {
                                            const atualizado = { ...clienteSelecionado };
                                            atualizado.endereco = { ...atualizado.endereco };
                                            if (campoEndereco) {
                                                atualizado.endereco[campoEndereco] = novoValor;
                                            }
                                            await atualizarCliente(atualizado);
                                            setClienteSelecionado(atualizado);
                                            setCampoEndereco(null);
                                            setCampoAtualizar(null);
                                            setNovoValor("");
                                        }}
                                    >Salvar</button>
                                    <button className="bg-gray-300 px-3 py-1 rounded" onClick={() => {
                                        setCampoEndereco(null);
                                        setNovoValor("");
                                    }}>Cancelar</button>
                                </>
                            )}
                        </>
                    ) : campoAtualizar === "produtosAssociados" ? (
                        <>
                            <h2 className="text-xl font-bold">Produtos Associados</h2>
                            <ul className="mb-2">
                                {todosProdutos
                                    .filter(produto => produtosSelecionados.includes(produto.id))
                                    .map(produto => (
                                        <li key={produto.id} className="flex items-center gap-2 mb-1">
                                            <span>{produto.nome}</span>
                                            <button
                                                className="bg-red-500 text-white px-2 py-1 rounded"
                                                onClick={() =>
                                                    setProdutosSelecionados(produtosSelecionados.filter(id => id !== produto.id))
                                                }
                                            >
                                                Remover
                                            </button>
                                        </li>
                                    ))}
                                {produtosSelecionados.length === 0 && (
                                    <li className="text-gray-600">Nenhum produto associado.</li>
                                )}
                            </ul>
                            <div className="flex flex-col gap-2 mb-2 relative">
                                <input
                                    type="text"
                                    placeholder="Pesquisar produto para adicionar..."
                                    className="px-2 py-1 rounded border"
                                    value={novoValor}
                                    onChange={e => setNovoValor(e.target.value)}
                                    autoComplete="off"
                                />
                                {novoValor && (
                                    <ul className="absolute z-10 bg-white border rounded shadow max-h-40 overflow-y-auto w-full mt-10">
                                        {todosProdutos
                                            .filter(produto =>
                                                !produtosSelecionados.includes(produto.id) &&
                                                produto.nome.toLowerCase().includes(novoValor.toLowerCase())
                                            )
                                            .map(produto => (
                                                <li
                                                    key={produto.id}
                                                    className="px-3 py-2 hover:bg-purple-100 cursor-pointer"
                                                    onClick={() => {
                                                        setProdutosSelecionados([...produtosSelecionados, produto.id]);
                                                        setNovoValor("");
                                                    }}
                                                >
                                                    {produto.nome}
                                                </li>
                                            ))}
                                        {/* Se não houver sugestões */}
                                        {todosProdutos.filter(produto =>
                                            !produtosSelecionados.includes(produto.id) &&
                                            produto.nome.toLowerCase().includes(novoValor.toLowerCase())
                                        ).length === 0 && (
                                            <li className="px-3 py-2 text-gray-400">Nenhum produto encontrado</li>
                                        )}
                                    </ul>
                                )}
                            </div>
                            <button
                                className="bg-purple-500 text-white hover:bg-purple-600 px-3 py-1 rounded"
                                onClick={async () => {
                                    await atualizarProdutosAssociados(clienteSelecionado.id, produtosSelecionados);
                                    setCampoAtualizar(null);
                                    setNovoValor("");
                                }}
                            >
                                Salvar
                            </button>
                            <button
                                className="bg-gray-300 px-3 py-1 rounded"
                                onClick={() => setCampoAtualizar(null)}
                            >
                                Cancelar
                            </button>
                        </>
                    ) : campoAtualizar === "servicosAssociados" ? (
                        <>
                            <h2 className="text-xl font-bold">Serviços Associados</h2>
                            <ul className="mb-2">
                                {todosServicos
                                    .filter(servico => servicosSelecionados.includes(servico.id))
                                    .map(servico => (
                                        <li key={servico.id} className="flex items-center gap-2 mb-1">
                                            <span>{servico.nome}</span>
                                            <button
                                                className="bg-red-500 text-white px-2 py-1 rounded"
                                                onClick={() =>
                                                    setServicosSelecionados(servicosSelecionados.filter(id => id !== servico.id))
                                                }
                                            >
                                                Remover
                                            </button>
                                        </li>
                                    ))}
                                {servicosSelecionados.length === 0 && (
                                    <li className="text-gray-600">Nenhum serviço associado.</li>
                                )}
                            </ul>
                            <div className="flex flex-col gap-2 mb-2 relative">
                                <input
                                    type="text"
                                    placeholder="Pesquisar serviço para adicionar..."
                                    className="px-2 py-1 rounded border"
                                    value={novoValor}
                                    onChange={e => setNovoValor(e.target.value)}
                                    autoComplete="off"
                                />
                                {novoValor && (
                                    <ul className="absolute z-10 bg-white border rounded shadow max-h-40 overflow-y-auto w-full mt-10">
                                        {todosServicos
                                            .filter(servico =>
                                                !servicosSelecionados.includes(servico.id) &&
                                                servico.nome.toLowerCase().includes(novoValor.toLowerCase())
                                            )
                                            .map(servico => (
                                                <li
                                                    key={servico.id}
                                                    className="px-3 py-2 hover:bg-purple-100 cursor-pointer"
                                                    onClick={() => {
                                                        setServicosSelecionados([...servicosSelecionados, servico.id]);
                                                        setNovoValor("");
                                                    }}
                                                >
                                                    {servico.nome}
                                                </li>
                                            ))}
                                        {/* Se não houver sugestões */}
                                        {todosServicos.filter(servico =>
                                            !servicosSelecionados.includes(servico.id) &&
                                            servico.nome.toLowerCase().includes(novoValor.toLowerCase())
                                        ).length === 0 && (
                                            <li className="px-3 py-2 text-gray-400">Nenhum serviço encontrado</li>
                                        )}
                                    </ul>
                                )}
                            </div>
                            <button
                                className="bg-purple-500 text-white hover:bg-purple-600 px-3 py-1 rounded"
                                onClick={async () => {
                                    await atualizarServicosAssociados(clienteSelecionado.id, servicosSelecionados);
                                    setCampoAtualizar(null);
                                    setNovoValor("");
                                }}
                            >
                                Salvar
                            </button>
                            <button
                                className="bg-gray-300 px-3 py-1 rounded"
                                onClick={() => setCampoAtualizar(null)}
                            >
                                Cancelar
                            </button>
                        </>
                    ) : campoAtualizar === "genero" ? (
                        <>
                            <h2 className="text-xl font-bold">Atualizar Gênero</h2>
                            <div className="flex gap-4 mb-4">
                                <button
                                    className={`px-4 py-2 rounded ${novoValor === "masculino" ? "bg-purple-700 text-white" : "bg-gray-200"}`}
                                    onClick={() => setNovoValor("masculino")}
                                >
                                    Masculino
                                </button>
                                <button
                                    className={`px-4 py-2 rounded ${novoValor === "feminino" ? "bg-purple-700 text-white" : "bg-gray-200"}`}
                                    onClick={() => setNovoValor("feminino")}
                                >
                                    Feminino
                                </button>
                            </div>
                            <button
                                className="bg-purple-500 text-white rounded hover:bg-purple-600 px-3 py-1 "
                                disabled={!novoValor}
                                onClick={async () => {
                                    const atualizado = { ...clienteSelecionado, genero: novoValor };
                                    await atualizarCliente(atualizado);
                                    setClienteSelecionado(atualizado);
                                    setCampoAtualizar(null);
                                    setNovoValor("");
                                }}
                            >
                                Salvar
                            </button>
                            <button
                                className="bg-white px-3 py-1 rounded"
                                onClick={() => {
                                    setCampoAtualizar(null);
                                    setNovoValor("");
                                }}
                            >
                                Cancelar
                            </button>
                        </>
                    ) : (
                        <>
                            <h2 className="text-xl font-bold">Novo valor para {campoAtualizar}:</h2>
                            <input
                                type="text"
                                value={novoValor}
                                onChange={e => setNovoValor(e.target.value)}
                                className="px-3 py-2 max-w-80 rounded border border-gray-300"
                            />
                            <button
                                className="bg-purple-500 text-white hover:bg-purple-600 px-3 py-1 rounded"
                                onClick={async () => {
                                    const atualizado = { ...clienteSelecionado };
                                    if (campoAtualizar === "nome") atualizado.nome = novoValor;
                                    if (campoAtualizar === "sobrenome") atualizado.sobrenome = novoValor;
                                    if (campoAtualizar === "email") atualizado.email = novoValor;
                                    if (campoAtualizar === "endereco") atualizado.endereco = { ...atualizado.endereco, rua: novoValor }; 
                                    await atualizarCliente(atualizado);
                                    setClienteSelecionado(atualizado);
                                    setCampoAtualizar(null);
                                    setNovoValor("");
                                }}
                            >Salvar</button>
                            <button className="bg-gray-300 px-3 py-1 rounded" onClick={() => setCampoAtualizar(null)}>Cancelar</button>
                        </>
                    )}
                    {(clienteSelecionado || campoAtualizar) && (
                        <button className="mt-2 px-3 py-1 bg-gray-300 rounded" onClick={() => {
                            setClienteSelecionado(null);
                            setCampoAtualizar(null);
                            setNovoValor("");
                            setNovoTelefone({ ddd: "", numero: "" });
                            setTelefoneEditando(null);
                        }}>Reiniciar</button>
                    )}
                </div>
            )}

            {mostrarListagens && (
                <div className="flex flex-wrap p-4 gap-4 justify-center bg-[#dba2eb]">
                    <button 
                        className="flex justify-center items-center px-4 py-2 rounded h-12 w-full max-w-xs hover:bg-purple-600 transition bg-purple-400"
                        onClick={() => {
                            setMostrarListaClientes(true);
                            setMostrarListagemGenero(false);
                            setMostrarMaioresConsumidores(false);
                            setMostrarMenoresConsumidores(false);
                            setMostrarTop5Valor(false);
                        }}
                    >
                        listagem Geral
                    </button>
                    <button
                        className="flex justify-center items-center px-4 py-2 rounded h-12 w-full max-w-xs hover:bg-purple-600 transition bg-purple-400"
                        onClick={() => {
                            setMostrarListagemGenero(true);
                            setMostrarListaClientes(false);
                            setMostrarMaioresConsumidores(false);
                            setMostrarMenoresConsumidores(false);
                            setMostrarTop5Valor(false);
                        }}
                    >
                        Listagem por gênero
                    </button>
                    <button
                        className="flex justify-center items-center px-4 py-2 rounded h-12 w-full max-w-xs hover:bg-purple-600 transition bg-purple-400"
                        onClick={async () => {
                            setMostrarListaClientes(false);
                            setMostrarListagemGenero(false);
                            setMostrarMenoresConsumidores(false);
                            setMostrarTop5Valor(false);
                            const data = await buscarMaioresConsumidores();
                            setMaioresConsumidores(data || []);
                            setMostrarMaioresConsumidores(true);
                        }}
                    >
                        Maiores consumidores
                    </button>
                    <button
                        className="flex justify-center items-center px-4 py-2 rounded h-12 w-full max-w-xs hover:bg-purple-600 transition bg-purple-400"
                        onClick={async () => {
                            setMostrarListaClientes(false);
                            setMostrarListagemGenero(false);
                            setMostrarMaioresConsumidores(false);
                            setMostrarTop5Valor(false);
                            const data = await BuscarMenoresConsumidores();
                            setMenoresConsumidores(data || []);
                            setMostrarMenoresConsumidores(true);
                        }}
                    >
                        Menores consumidores
                    </button>
                    <button
                        className="flex justify-center items-center px-4 py-2 rounded h-12 w-full max-w-xs hover:bg-purple-600 transition bg-purple-400"
                        onClick={async () => {
                            setMostrarListaClientes(false);
                            setMostrarListagemGenero(false);
                            setMostrarMaioresConsumidores(false);
                            setMostrarMenoresConsumidores(false);
                            const data = await BuscarTop5Valor();
                            setTop5Valor(data || []);
                            setMostrarTop5Valor(true);
                        }}
                    >
                        Top 5 (Valor)
                    </button>
                </div>
            )}

            {mostrarListaClientes && (
                <div className="p-4 bg-purple-400 rounded shadow mx-7 my-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-2">
                        <h2 className="text-lg font-bold">Clientes cadastrados</h2>
                        <input
                            type="text"
                            placeholder="Pesquisar por nome..."
                            value={filtroNome}
                            onChange={e => setFiltroNome(e.target.value)}
                            className="px-3 py-2 rounded w-full md:w-72 border border-gray-300"
                        />
                    </div>
                    <ul className="divide-y divide-gray-200">
                        {clientes
                            .filter(cliente =>
                                cliente.nome?.toLowerCase().includes(filtroNome.toLowerCase())
                            )
                            .map((cliente, index) => (
                            <li key={index} className="py-2">
                                <div className="mb-1">
                                    <span className="font-semibold ml-2">{cliente.nome}</span>
                                    <span>{cliente.sobrenome && ` ${cliente.sobrenome}`}</span>
                                    {cliente.id && <span className="font-semibold ml-2">id: {cliente.id}</span>}
                                </div>
                                <div className="ml-4 text-sm">
                                    <div>
                                        <span className="font-semibold">Email:</span> {cliente.email || "-"}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Telefone(s):</span>{" "}
                                        {(cliente.telefones && cliente.telefones.length > 0)
                                            ? cliente.telefones.map((telefone: any, i: number) =>
                                                <span key={i}>
                                                    ({telefone.ddd}) {telefone.numero}{i < cliente.telefones.length - 1 ? ", " : ""}
                                                </span>
                                            )
                                            : "-"}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Endereço:</span>{" "}
                                        {cliente.endereco
                                            ? `${cliente.endereco.rua || ""}, ${cliente.endereco.numero || ""}, ${cliente.endereco.bairro || ""}, ${cliente.endereco.cidade || ""}, ${cliente.endereco.estado || ""}, CEP: ${cliente.endereco.codigo_postal || ""}`
                                            : "-"}
                                    </div>
                                    {cliente.endereco && cliente.endereco.informacoes_adicionais && (
                                        <div>
                                            <span className="font-semibold">Informações adicionais:</span> {cliente.endereco.informacoes_adicionais}
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {mostrarExcluirCliente && (
                <div className="flex flex-col gap-4 bg-purple-400 p-4 rounded shadow mx-7 my-4">
                    <h2 className="text-xl font-bold">Informe o nome do cliente para excluir:</h2>
                    <input
                        type="text"
                        placeholder="Pesquisar por nome..."
                        value={nomeParaExcluir}
                        onChange={e => setNomeParaExcluir(e.target.value)}
                        className="px-3 py-2 max-w-80 rounded border border-gray-300"
                    />
                    <ul className="divide-y divide-gray-200 max-h-40 overflow-y-auto">
                        {clientesParaExcluir.map((cliente, idx) => (
                            <li key={cliente.id || idx} className="py-2 flex justify-between items-center">
                                <span>
                                    {cliente.nome} {cliente.sobrenome && cliente.sobrenome} (id: {cliente.id})
                                </span>
                                <button
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    disabled={excluindo}
                                    onClick={async () => {
                                        setExcluindo(true);
                                        setErroExclusao(null);
                                        setSucessoExclusao(null);
                                        try {
                                            await excluirCliente(cliente);
                                            setSucessoExclusao("Cliente excluído com sucesso!");
                                            setClientesParaExcluir(prev => prev.filter(c => c.id !== cliente.id));
                                            setClientes(prev => prev.filter(c => c.id !== cliente.id));
                                        } catch {
                                            setErroExclusao("Erro ao excluir cliente.");
                                        }
                                        setExcluindo(false);
                                    }}
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
                                setClientesParaExcluir([]);
                                setErroExclusao(null);
                                setSucessoExclusao(null);
                                setMostrarExcluirCliente(false);
                            }}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}

            {mostrarListagemGenero && (
                <div className="p-4 bg-purple-400 rounded shadow mx-7 my-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
                        <h2 className="text-lg font-bold">Clientes por gênero</h2>
                        <div className="flex gap-2">
                            <button
                                className={`px-4 py-2 rounded ${generoSelecionado === "masculino" ? "bg-purple-700 text-white" : "bg-gray-200"}`}
                                onClick={() => setGeneroSelecionado("masculino")}
                            >
                                Masculino
                            </button>
                            <button
                                className={`px-4 py-2 rounded ${generoSelecionado === "feminino" ? "bg-purple-700 text-white" : "bg-gray-200"}`}
                                onClick={() => setGeneroSelecionado("feminino")}
                            >
                                Feminino
                            </button>
                        </div>
                    </div>
                    <ul className="divide-y divide-gray-200">
                        {clientes
                            .filter(cliente => generoSelecionado ? cliente.genero === generoSelecionado : true)
                            .map((cliente, index) => (
                                <li key={cliente.id || index} className="py-2">
                                    <div className="mb-1">
                                        <span className="font-semibold ml-2">{cliente.nome}</span>
                                        <span>{cliente.sobrenome && ` ${cliente.sobrenome}`}</span>
                                        {cliente.id && <span className="font-semibold ml-2">id: {cliente.id}</span>}
                                    </div>
                                    <div className="ml-4 text-sm">
                                        <div>
                                            <span className="font-semibold">Gênero:</span> {cliente.genero}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Email:</span> {cliente.email || "-"}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Telefone(s):</span>{" "}
                                            {(cliente.telefones && cliente.telefones.length > 0)
                                                ? cliente.telefones.map((telefone: any, i: number) =>
                                                    <span key={i}>
                                                        ({telefone.ddd}) {telefone.numero}{i < cliente.telefones.length - 1 ? ", " : ""}
                                                    </span>
                                                )
                                                : "-"}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Endereço:</span>{" "}
                                            {cliente.endereco
                                                ? `${cliente.endereco.rua || ""}, ${cliente.endereco.numero || ""}, ${cliente.endereco.bairro || ""}, ${cliente.endereco.cidade || ""}, ${cliente.endereco.estado || ""}, CEP: ${cliente.endereco.codigo_postal || ""}`
                                                : "-"}
                                        </div>
                                        {cliente.endereco && cliente.endereco.informacoes_adicionais && (
                                            <div>
                                                <span className="font-semibold">Informações adicionais:</span> {cliente.endereco.informacoes_adicionais}
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                    </ul>
                </div>
            )}

            {mostrarMaioresConsumidores && (
                <div className="p-4 bg-purple-400 rounded shadow mx-7 my-4">
                    <h2 className="text-lg font-bold mb-2">Top 10 Maiores Consumidores (Quantidade de Produtos/Serviços)</h2>
                    <ul className="divide-y divide-gray-200">
                        {maioresConsumidores.length === 0 && (
                            <li className="py-2 text-gray-600">Nenhum cliente encontrado.</li>
                        )}
                        {maioresConsumidores.map((cliente, index) => (
                            <li key={cliente.id || index} className="py-2 flex flex-col">
                                <div>
                                    <span className="font-semibold">{index + 1}º - {cliente.nome}</span>
                                    <span>{cliente.sobrenome && ` ${cliente.sobrenome}`}</span>
                                    {cliente.id && <span className="font-semibold ml-2">id: {cliente.id}</span>}
                                </div>
                                <div className="ml-4 text-sm">
                                    <span className="font-semibold">Total consumido:</span> {cliente.total_consumido}
                                    <span className="ml-4 font-semibold">Produtos:</span> {cliente.produtos_qtd}
                                    <span className="ml-4 font-semibold">Serviços:</span> {cliente.servicos_qtd}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-end mt-4">
                        <button
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            onClick={() => setMostrarMaioresConsumidores(false)}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}

            {mostrarMenoresConsumidores && (
                <div className="p-4 bg-purple-400 rounded shadow mx-7 my-4">
                    <h2 className="text-lg font-bold mb-2">Top 10 Menores Consumidores (Quantidade de Produtos/Serviços)</h2>
                    <ul className="divide-y divide-gray-200">
                        {menoresConsumidores.length === 0 && (
                            <li className="py-2 text-gray-600">Nenhum cliente encontrado.</li>
                        )}
                        {menoresConsumidores.map((cliente, index) => (
                            <li key={cliente.id || index} className="py-2 flex flex-col">
                                <div>
                                    <span className="font-semibold">{index + 1}º - {cliente.nome}</span>
                                    <span>{cliente.sobrenome && ` ${cliente.sobrenome}`}</span>
                                    {cliente.id && <span className="font-semibold ml-2">id: {cliente.id}</span>}
                                </div>
                                <div className="ml-4 text-sm">
                                    <span className="font-semibold">Total consumido:</span> {cliente.total_consumido}
                                    <span className="ml-4 font-semibold">Produtos:</span> {cliente.produtos_qtd}
                                    <span className="ml-4 font-semibold">Serviços:</span> {cliente.servicos_qtd}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-end mt-4">
                        <button
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            onClick={() => setMostrarMenoresConsumidores(false)}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}

            {mostrarTop5Valor && (
                <div className="p-4 bg-purple-400 rounded shadow mx-7 my-4">
                    <h2 className="text-lg font-bold mb-2">Top 5 Clientes por Valor Consumido</h2>
                    <ul className="divide-y divide-gray-200">
                        {top5Valor.length === 0 && (
                            <li className="py-2 text-gray-600">Nenhum cliente encontrado.</li>
                        )}
                        {top5Valor.map((cliente, index) => (
                            <li key={cliente.id || index} className="py-2 flex flex-col">
                                <div>
                                    <span className="font-semibold">{index + 1}º - {cliente.nome}</span>
                                    <span>{cliente.sobrenome && ` ${cliente.sobrenome}`}</span>
                                    {cliente.id && <span className="font-semibold ml-2">id: {cliente.id}</span>}
                                </div>
                                <div className="ml-4 text-sm">
                                    <span className="font-semibold">Valor total consumido:</span> R$ {Number(cliente.valor_total).toFixed(2)}
                                    <span className="ml-4 font-semibold">Produtos:</span> R$ {Number(cliente.valor_produtos).toFixed(2)}
                                    <span className="ml-4 font-semibold">Serviços:</span> R$ {Number(cliente.valor_servicos).toFixed(2)}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-end mt-4">
                        <button
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            onClick={() => setMostrarTop5Valor(false)}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}

            <Modal isOpen={modalAberto} onClose={fecharModal}>
                {modalConteudo}
            </Modal>
        </>
    );
};

export default Clientes;