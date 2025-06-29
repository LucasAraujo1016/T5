import React, { useState, useEffect } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { cadastrarCliente } from "../api/clientes";
import { listarProdutos } from "../api/produtos";
import { listarServicos } from "../api/servicos";
import { supabase } from "../api/supabaseClient";

const CadastroCliente = ({ onClose }: { onClose: () => void }) => {
    const [etapa, setEtapa] = useState(1);
    const [nome, setNome] = useState("");
    const [sobreNome, setSobreNome] = useState("");
    const [email, setEmail] = useState("");
    const [ddd, setDdd] = useState("");
    const [numero, setNumero] = useState("");
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [estado, setEstado] = useState("");
    const [cidade, setCidade] = useState("");
    const [bairro, setBairro] = useState("");
    const [rua, setRua] = useState("");
    const [numeroEndereco, setNumeroEndereco] = useState("");
    const [codigoPostal, setCodigoPostal] = useState("");
    const [informacoesAdicionais, setInformacoesAdicionais] = useState("");
    const [produtoSelecionado, setProdutoSelecionado] = useState<string>("");
    const [servicoSelecionado, setServicoSelecionado] = useState<string>("");
    const [produtos, setProdutos] = useState<any[]>([]);
    const [servicos, setServicos] = useState<any[]>([]);
    const [genero, setGenero] = useState<"masculino" | "feminino" | "">("");

    useEffect(() => {
        if (etapa === 3) {
            listarProdutos().then(setProdutos).catch(() => setProdutos([]));
            listarServicos().then(setServicos).catch(() => setServicos([]));
        }
    }, [etapa]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro("");
        setSucesso("");
        if (!nome.trim() || !sobreNome.trim()) {
            setErro("Nome e Sobrenome são obrigatórios.");
            return;
        }
        if (!genero) {
            setErro("Selecione o gênero.");
            return;
        }
        try {
            const novoCliente = await cadastrarCliente({
                nome,
                sobreNome,
                email,
                genero,
                telefones: ddd && numero ? [{ ddd, numero }] : [],
                endereco: {
                    estado,
                    cidade,
                    bairro,
                    rua,
                    numero: numeroEndereco,
                    codigo_postal: codigoPostal,
                    informacoes_adicionais: informacoesAdicionais
                }
            });

            if (produtoSelecionado) {
                await supabase
                    .from("produtos_consumidos")
                    .insert([{ cliente_id: novoCliente.id, produto_id: Number(produtoSelecionado) }]);
            }

            if (servicoSelecionado) {
                await supabase
                    .from("servicos_consumidos")
                    .insert([{ cliente_id: novoCliente.id, servico_id: Number(servicoSelecionado) }]);
            }

            if (ddd && numero) {
                await supabase
                    .from("telefones")
                    .insert([{ ddd, numero, cliente_id: novoCliente.id }]);
            }

            setSucesso("Cliente cadastrado com sucesso!");
            setNome(""); setSobreNome(""); setEmail(""); setDdd(""); setNumero("");
            setEstado(""); setCidade(""); setBairro(""); setRua(""); setNumeroEndereco(""); setCodigoPostal(""); setInformacoesAdicionais("");
            setProdutoSelecionado(""); setServicoSelecionado("");
            setTimeout(() => {
                setSucesso("");
                onClose();
            }, 1200);
        } catch (err) {
            setErro("Erro ao cadastrar cliente");
            console.error(err);
        }
    };

    return (
        <div className="flex justify-center p-4 sm:p-0 sm:mb-0">
            <form className="w-full sm:p-8 rounded shadow mx-2" onSubmit={handleSubmit}>
                {etapa === 1 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nome
                                </label>
                                <input
                                    type="text"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-purple-500 focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Sobrenome
                                </label>
                                <input
                                    type="text"
                                    value={sobreNome}
                                    onChange={(e) => setSobreNome(e.target.value)}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-purple-500 focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    DDD
                                </label>
                                <input
                                    type="text"
                                    value={ddd}
                                    onChange={(e) => setDdd(e.target.value)}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-purple-500 focus:outline-none"
                                    maxLength={2}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Telefone
                                </label>
                                <input
                                    type="text"
                                    value={numero}
                                    onChange={(e) => setNumero(e.target.value)}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-purple-500 focus:outline-none"
                                    maxLength={9}
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    E-mail
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-purple-500 focus:outline-none"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Gênero
                                </label>
                                <select
                                    value={genero}
                                    onChange={e => setGenero(e.target.value as "masculino" | "feminino" | "")}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-purple-500 focus:outline-none"
                                    required
                                >
                                    <option value="">Selecione o gênero</option>
                                    <option value="masculino">Masculino</option>
                                    <option value="feminino">Feminino</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="flex items-center gap-2 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={() => setEtapa(2)}
                            >
                                Avançar
                                <ArrowRightIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </>
                )}
                {etapa === 2 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Estado
                                </label>
                                <input
                                    type="text"
                                    value={estado}
                                    onChange={(e) => setEstado(e.target.value)}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-purple-500 focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cidade
                                </label>
                                <input
                                    type="text"
                                    value={cidade}
                                    onChange={(e) => setCidade(e.target.value)}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-purple-500 focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Bairro
                                </label>
                                <input
                                    type="text"
                                    value={bairro}
                                    onChange={(e) => setBairro(e.target.value)}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-purple-500 focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Rua
                                </label>
                                <input
                                    type="text"
                                    value={rua}
                                    onChange={(e) => setRua(e.target.value)}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-purple-500 focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Número
                                </label>
                                <input
                                    type="text"
                                    value={numeroEndereco}
                                    onChange={(e) => setNumeroEndereco(e.target.value)}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-purple-500 focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Código Postal
                                </label>
                                <input
                                    type="text"
                                    value={codigoPostal}
                                    onChange={(e) => setCodigoPostal(e.target.value)}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-purple-500 focus:outline-none"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Informações Adicionais
                            </label>
                            <textarea
                                value={informacoesAdicionais}
                                onChange={e => setInformacoesAdicionais(e.target.value)}
                                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 mb-2 focus:ring focus:ring-purple-500 focus:outline-none"
                                rows={2}
                                placeholder="Ex: ponto de referência, observações, etc."
                            />
                        </div>
                        <div className="flex justify-between gap-4">
                            <button
                                type="button"
                                className="flex items-center bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={() => setEtapa(1)}
                            >
                                <ArrowLeftIcon className="h-5 w-5" />
                                Voltar
                            </button>
                            <button
                                type="button"
                                className="flex items-center gap-2 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={() => setEtapa(3)}
                            >
                                Avançar
                                <ArrowRightIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </>
                )}
                {etapa === 3 && (
                    <>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Produto
                            </label>
                            <select
                                value={produtoSelecionado}
                                onChange={(e) => setProdutoSelecionado(e.target.value)}
                                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-purple-500 focus:outline-none"
                            >
                                <option value="">Selecione um produto</option>
                                {produtos.map((produto) => (
                                    <option key={produto.id} value={produto.id}>
                                        {produto.nome}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Serviço
                            </label>
                            <select
                                value={servicoSelecionado}
                                onChange={(e) => setServicoSelecionado(e.target.value)}
                                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-purple-500 focus:outline-none"
                            >
                                <option value="">Selecione um serviço</option>
                                {servicos.map((servico) => (
                                    <option key={servico.id} value={servico.id}>
                                        {servico.nome}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-between gap-4">
                            <button
                                type="button"
                                className="flex items-center bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                onClick={() => setEtapa(2)}
                            >
                                <ArrowLeftIcon className="h-5 w-5" />
                                Voltar
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-2 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Cadastrar
                                <ArrowRightIcon className="h-5 w-5" />
                            </button>
                        </div>
                        {erro && (
                            <div className="mt-4 text-red-600 text-sm">
                                {erro}
                            </div>
                        )}
                        {sucesso && (
                            <div className="mt-4 text-green-600 text-sm">
                                {sucesso}
                            </div>
                        )}
                    </>
                )}
            </form>
        </div>
    );
};

export default CadastroCliente;