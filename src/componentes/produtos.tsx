import React, { useEffect, useState } from "react";
import { ArrowLeftIcon, ListBulletIcon, ShoppingBagIcon, TrashIcon } from "@heroicons/react/24/solid";
import { listarProdutos, atualizarProduto, excluirProduto } from "../api/produtos";

type Props = {
    tema: string;
    seletorView: (novaTela: string, evento: any) => void;
};

const Produtos: React.FC<Props> = ({ tema, seletorView }) => {
    const [produtos, setProdutos] = useState<any[]>([]);
    const [filtroNome, setFiltroNome] = useState("");
    const [mostrarListagem, setMostrarListagem] = useState(false);
    const [mostrarAtualizar, setMostrarAtualizar] = useState(false);
    const [mostrarExcluir, setMostrarExcluir] = useState(false);

    const [nomeParaAtualizar, setNomeParaAtualizar] = useState("");
    const [produtosParaAtualizar, setProdutosParaAtualizar] = useState<any[]>([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState<any>(null);
    const [novoNome, setNovoNome] = useState("");
    const [novoValor, setNovoValor] = useState("");
    const [sucesso, setSucesso] = useState<string | null>(null);
    const [erro, setErro] = useState<string | null>(null);

    const [nomeParaExcluir, setNomeParaExcluir] = useState("");
    const [produtosParaExcluir, setProdutosParaExcluir] = useState<any[]>([]);
    const [produtoParaExcluir, setProdutoParaExcluir] = useState<any>(null);
    const [sucessoExclusao, setSucessoExclusao] = useState<string | null>(null);
    const [erroExclusao, setErroExclusao] = useState<string | null>(null);
    const [excluindo, setExcluindo] = useState(false);

    useEffect(() => {
        listarProdutos().then(setProdutos).catch(console.error);
    }, []);

    useEffect(() => {
        if (mostrarAtualizar && nomeParaAtualizar.length > 0) {
            setProdutosParaAtualizar(
                produtos.filter((p: any) =>
                    p.nome?.toLowerCase().includes(nomeParaAtualizar.toLowerCase())
                )
            );
        } else {
            setProdutosParaAtualizar([]);
        }
    }, [nomeParaAtualizar, mostrarAtualizar, produtos]);

    useEffect(() => {
        if (mostrarExcluir && nomeParaExcluir.length > 0) {
            setProdutosParaExcluir(
                produtos.filter((p: any) =>
                    p.nome?.toLowerCase().includes(nomeParaExcluir.toLowerCase())
                )
            );
        } else {
            setProdutosParaExcluir([]);
        }
    }, [nomeParaExcluir, mostrarExcluir, produtos]);

    const handleAtualizarProduto = async () => {
        try {
            await atualizarProduto({
                id: produtoSelecionado.id,
                nome: novoNome,
                valor: parseFloat(novoValor)
            });
            setProdutos(produtos.map(p =>
                p.id === produtoSelecionado.id
                    ? { ...p, nome: novoNome, valor: parseFloat(novoValor) }
                    : p
            ));
            setSucesso("Produto atualizado com sucesso!");
            setTimeout(() => {
                setProdutoSelecionado(null);
                setNovoNome("");
                setNovoValor("");
                setSucesso(null);
                setMostrarAtualizar(false);
            }, 1200);
        } catch (e) {
            setErro("Erro ao atualizar produto.");
        }
    };

    const handleExcluirProduto = async (produto: any) => {
        setExcluindo(true);
        setErroExclusao(null);
        setSucessoExclusao(null);
        try {
            await excluirProduto(produto);
            setProdutos(produtos.filter(p => p.id !== produto.id));
            setSucessoExclusao("Produto excluído com sucesso!");
            setProdutosParaExcluir(prev => prev.filter(p => p.id !== produto.id));
        } catch {
            setErroExclusao("Erro ao excluir produto.");
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
                    className="flex flex-col justify-center items-center px-4 py-2 rounded h-52 w-full max-w-xs hover:bg-purple-600 transition bg-[#c35de8]"
                    onClick={() => {
                        setMostrarAtualizar(true);
                        setMostrarExcluir(false);
                        setMostrarListagem(false);
                    }}
                >
                    <ShoppingBagIcon className="h-16 w-16 mb-4" />
                    Atualizar Produto
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
                    Excluir Produto
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
                    {!produtoSelecionado ? (
                        <>
                            <h2 className="text-xl font-bold">Digite o nome do produto para atualizar:</h2>
                            <input
                                type="text"
                                placeholder="Pesquisar por nome..."
                                value={nomeParaAtualizar}
                                onChange={e => setNomeParaAtualizar(e.target.value)}
                                className="px-3 py-2 max-w-80 rounded border border-gray-300"
                            />
                            <ul className="divide-y divide-gray-200 max-h-40 overflow-y-auto">
                                {produtosParaAtualizar.map((produto, idx) => (
                                    <li key={produto.id || idx} className="py-2 flex justify-between items-center">
                                        <span>
                                            {produto.nome} (R$ {produto.valor}) (id: {produto.id})
                                        </span>
                                        <button
                                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            onClick={() => {
                                                setProdutoSelecionado(produto);
                                                setNovoNome(produto.nome);
                                                setNovoValor(produto.valor?.toString() || "");
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
                            <h2 className="text-xl font-bold">Atualizar Produto</h2>
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
                                        setProdutoSelecionado(null);
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
                                    onClick={handleAtualizarProduto}
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
                    <h2 className="text-xl font-bold">Informe o nome do produto para excluir:</h2>
                    <input
                        type="text"
                        placeholder="Pesquisar por nome..."
                        value={nomeParaExcluir}
                        onChange={e => setNomeParaExcluir(e.target.value)}
                        className="px-3 py-2 max-w-80 rounded border border-gray-300"
                    />
                    <ul className="divide-y divide-gray-200 max-h-40 overflow-y-auto">
                        {produtosParaExcluir.map((produto, idx) => (
                            <li key={produto.id || idx} className="py-2 flex justify-between items-center">
                                <span>
                                    {produto.nome} (R$ {produto.valor}) (id: {produto.id})
                                </span>
                                <button
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    disabled={excluindo}
                                    onClick={() => handleExcluirProduto(produto)}
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
                                setProdutosParaExcluir([]);
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
                        <h2 className="text-lg font-bold">Produtos cadastrados</h2>
                        <input
                            type="text"
                            placeholder="Pesquisar por nome..."
                            value={filtroNome}
                            onChange={e => setFiltroNome(e.target.value)}
                            className="px-3 py-2 rounded w-full md:w-72 border border-gray-300"
                        />
                    </div>
                    <ul className="divide-y divide-gray-200">
                        {produtos
                            .filter(produto =>
                                produto.nome?.toLowerCase().includes(filtroNome.toLowerCase())
                            )
                            .map((produto, index) => (
                                <li key={produto.id || index} className="py-2">
                                    <span className="font-semibold ml-2">{produto.nome}</span>
                                    <span className="ml-2">R$ {produto.valor}</span>
                                    <span className="ml-2 text-gray-500">id: {produto.id}</span>
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default Produtos;