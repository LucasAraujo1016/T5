import { supabase } from "./supabaseClient";

export async function listarClientes() {
    const { data, error } = await supabase
        .from("clientes")
        .select(`
            *,
            endereco: endereco_id (*),
            telefones (*)
        `);

    if (error) throw error;
    return data.map(cliente => ({
        ...cliente,
        sobreNome: cliente.sobrenome,
        endereco: cliente.endereco,
        telefones: cliente.telefones
    }));
}

export async function cadastrarCliente(cliente: any) {
    const { data: endereco, error: erroEndereco } = await supabase
        .from("enderecos")
        .insert([cliente.endereco])
        .select()
        .single();
    if (erroEndereco) throw erroEndereco;

    const { data: novoCliente, error: erroCliente } = await supabase
        .from("clientes")
        .insert([{
            nome: cliente.nome,
            sobrenome: cliente.sobreNome,
            email: cliente.email,
            genero: cliente.genero, // <-- GARANTA QUE ESTA LINHA EXISTE!
            endereco_id: endereco.id
        }])
        .select()
        .single();
    if (erroCliente) throw erroCliente;

    return novoCliente;
}

export async function atualizarCliente(cliente: any) {
    const { error: erroCliente } = await supabase
        .from("clientes")
        .update({
            nome: cliente.nome,
            sobrenome: cliente.sobreNome,
            email: cliente.email
        })
        .eq("id", cliente.id);
    if (erroCliente) throw erroCliente;

    if (cliente.endereco && cliente.endereco.id) {
        const { error: erroEndereco } = await supabase
            .from("enderecos")
            .update(cliente.endereco)
            .eq("id", cliente.endereco.id);
        if (erroEndereco) throw erroEndereco;
    }

    if (cliente.telefones) {
        await supabase.from("telefones").delete().eq("cliente_id", cliente.id);
        for (const tel of cliente.telefones) {
            await supabase.from("telefones").insert([{
                ddd: tel.ddd,
                numero: tel.numero,
                cliente_id: cliente.id
            }]);
        }
    }
}

export async function excluirCliente(cliente: any) {
    const { error } = await supabase
        .from("clientes")
        .delete()
        .eq("id", cliente.id);
    if (error) throw error;
}

export  async function buscarMaioresConsumidores() {
    const { data, error } = await supabase
        .rpc('top_consumidores_quantidade');
    if (error) {
        throw error;
    }
    return data;
}

export async function BuscarMenoresConsumidores() {
    const { data, error } = await supabase
        .rpc('bottom_consumidores_quantidade');
    if (error) {
        throw error;
    }
    return data;
};

export async function BuscarTop5Valor() {
    const { data, error } = await supabase
        .rpc('top5_consumidores_valor');
    if (error) {
        throw error;
    }
    return(data);
};
