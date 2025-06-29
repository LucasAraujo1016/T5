import React, { useState } from "react";
import Modal from "./Modal";
import { ArrowLeftIcon, ArrowRightIcon, ScissorsIcon, ShoppingBagIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import CadastroProduto from "./cadastroProdutos";
import CadastroCliente from "./cadastroCliente";
import CadastroServico from "./cadastroServicos";

type Props = {
    tema: string,
    seletorView: (novaTela: string, evento: any) => void
};

const FormularioCadastro: React.FC<Props> = ({ tema, seletorView }) => {
    const [modalAberto, setModalAberto] = useState(false);
    const [modalConteudo, setModalConteudo] = useState<React.ReactNode>(null);

    const abrirModal = (conteudo: React.ReactNode) => {
        setModalAberto(true);
        setModalConteudo(conteudo);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setModalConteudo(null);
    };

    return (
        <>
            <h5 className="text-center text-lg md:text-2xl lg:text-3xl font-semibold p-4 md:p-6 pt-8 md:pt-12 bg-gradient-to-r from-pink-400 to-purple-500 text-white">
                Bem-vindo ao cadastro do <span className="ml-2 font-bold italic">Grupo World Beauty</span>
            </h5>
            <div className="w-full flex justify-center bg-[#dba2eb]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-6xl p-4">
                    <button
                        className="flex flex-col justify-center items-center px-4 py-2 rounded h-52 w-full hover:bg-purple-600 transition bg-[#d07af0]"
                        onClick={() =>
                            abrirModal(<CadastroCliente onClose={fecharModal} />)
                        }
                    >
                        <UserCircleIcon className="h-16 w-16 mb-4" />
                        Cadastro Cliente
                    </button>
                    <button
                        className="flex flex-col justify-center items-center px-4 py-2 rounded h-52 w-full hover:bg-purple-600 transition bg-[#c35de8]"
                        onClick={() =>
                            abrirModal(
                                <CadastroProduto onClose={fecharModal} />
                            )
                        }
                    >
                        <ShoppingBagIcon className="h-16 w-16 mb-4" />
                        Cadastro Produto
                    </button>
                    <button
                        className="flex flex-col justify-center items-center px-4 py-2 rounded h-52 w-full hover:bg-purple-600 transition bg-[#c35de8]"
                        onClick={() =>
                            abrirModal(
                                <CadastroServico onClose={fecharModal} />
                            )
                        }
                    >
                        <ScissorsIcon className="h-16 w-16 mb-4" />
                        Cadastro Serviços
                    </button>
                </div>
            </div>
            <Modal isOpen={modalAberto} onClose={fecharModal}>
                {modalConteudo}
            </Modal>
        </>
    );
};

export default FormularioCadastro;