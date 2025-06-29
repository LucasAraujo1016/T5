import React, { useState } from "react";
import { ArrowLeftIcon, ListBulletIcon } from "@heroicons/react/24/solid";
import { BuscarMaisConsumidos, BuscarMaisConsumidosPorGenero } from "../api/listagenseEspeciais";

type Props = {
    tema: string;
    seletorView: (novaTela: string, evento: any) => void;
};

const ListagensEspeciais: React.FC<Props> = ({ tema, seletorView }) => {
    const [mostrarMaisConsumidos, setMostrarMaisConsumidos] = useState(false);
    const [maisConsumidos, setMaisConsumidos] = useState<any[]>([]);
    const [carregando] = useState(false);
    const [generoSelecionado, setGeneroSelecionado] = useState<"masculino" | "feminino" | "">("");
    const [carregandoGenero, setCarregandoGenero] = useState(false);
    const [maisConsumidosGenero, setMaisConsumidosGenero] = useState<any[]>([]);
    const [mostrarMaisConsumidosGenero, setMostrarMaisConsumidosGenero] = useState(false);


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
            <div className="w-full flex justify-center bg-[#dba2eb]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-4xl p-4">
                    <button
                        className="flex flex-col justify-center items-center px-4 py-2 rounded h-52 w-full hover:bg-purple-600 transition bg-[#b358e8]"
                        onClick={async () => {
                            setMostrarMaisConsumidos(true);
                            const data = await BuscarMaisConsumidos();
                            setMaisConsumidos(data || []);
                            setMostrarMaisConsumidosGenero(false);
                        }}
                    >
                        <ListBulletIcon className="h-16 w-16 mb-4" />
                        Listagem de mais consumidos
                    </button>
                    <button
                        className="flex flex-col justify-center items-center px-4 py-2 rounded h-52 w-full hover:bg-purple-600 transition bg-[#b358e8]"
                        onClick={() => {
                            setMostrarMaisConsumidosGenero(true);
                            setGeneroSelecionado("");
                            setMaisConsumidosGenero([]);
                            setMostrarMaisConsumidos(false);
                        }}
                    >
                        <ListBulletIcon className="h-16 w-16 mb-4" />
                        Listagem de mais consumidos por gênero
                    </button>
                </div>
            </div>

            {mostrarMaisConsumidos && (
                <div className="p-4 bg-purple-400 rounded shadow mx-7 my-4">
                    <h2 className="text-lg font-bold mb-2">Top 10 Produtos/Serviços Mais Consumidos</h2>
                    {carregando ? (
                        <div className="text-center py-4">Carregando...</div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {maisConsumidos.length === 0 && (
                                <li className="py-2 text-gray-600">Nenhum registro encontrado.</li>
                            )}
                            {maisConsumidos.map((item, index) => (
                                <li key={item.id || index} className="py-2 flex flex-col">
                                    <div>
                                        <span className="font-semibold">{index + 1}º - {item.tipo === "produto" ? "Produto" : "Serviço"}: {item.nome}</span>
                                    </div>
                                    <div className="ml-4 text-sm">
                                        <span className="font-semibold">Total consumido:</span> {item.total_consumido}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="flex justify-end mt-4">
                        <button
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            onClick={() => setMostrarMaisConsumidos(false)}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}

            {mostrarMaisConsumidosGenero && (
                <div className="p-4 bg-purple-400 rounded shadow mx-7 my-4">
                    <h2 className="text-lg font-bold mb-2">Produtos/Serviços Mais Consumidos por Gênero</h2>
                    <div className="flex gap-4 mb-4">
                        <button
                            className={`px-4 py-2 rounded ${generoSelecionado === "masculino" ? "bg-purple-700 text-white" : "bg-gray-200"}`}
                            onClick={async () => {
                                setGeneroSelecionado("masculino");
                                setCarregandoGenero(true);
                                const data = await BuscarMaisConsumidosPorGenero("masculino");
                                setMaisConsumidosGenero(data || []);
                                setCarregandoGenero(false);
                            }}
                        >
                            Masculino
                        </button>
                        <button
                            className={`px-4 py-2 rounded ${generoSelecionado === "feminino" ? "bg-purple-700 text-white" : "bg-gray-200"}`}
                            onClick={async () => {
                                setGeneroSelecionado("feminino");
                                setCarregandoGenero(true);
                                const data = await BuscarMaisConsumidosPorGenero("feminino");
                                setMaisConsumidosGenero(data || []);
                                setCarregandoGenero(false);
                            }}
                        >
                            Feminino
                        </button>
                    </div>
                    {carregandoGenero ? (
                        <div className="text-center py-4">Carregando...</div>
                    ) : (
                        generoSelecionado && (
                            <ul className="divide-y divide-gray-200">
                                {maisConsumidosGenero.length === 0 && (
                                    <li className="py-2 text-gray-600">Nenhum registro encontrado.</li>
                                )}
                                {maisConsumidosGenero.map((item, index) => (
                                    <li key={item.id || index} className="py-2 flex flex-col">
                                        <div>
                                            <span className="font-semibold">{index + 1}º - {item.tipo === "produto" ? "Produto" : "Serviço"}: {item.nome}</span>
                                        </div>
                                        <div className="ml-4 text-sm">
                                            <span className="font-semibold">Total consumido:</span> {item.total_consumido}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )
                    )}
                    <div className="flex justify-end mt-4">
                        <button
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            onClick={() => setMostrarMaisConsumidosGenero(false)}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ListagensEspeciais;