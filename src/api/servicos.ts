import { supabase } from "./supabaseClient";

export async function cadastrarServico({ nome, valor }: { nome: string, valor: number }) {
    const { data, error } = await supabase
        .from("servicos")
        .insert([{ nome, valor }])
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function listarServicos() {
    const { data, error } = await supabase.from("servicos").select("*");
    if (error) throw error;
    return data;
}

export async function atualizarServico(servico: any) {
    const { error } = await supabase
        .from("servicos")
        .update({ nome: servico.nome, valor: servico.valor })
        .eq("id", servico.id);
    if (error) throw error;
}

export async function excluirServico(servico: any) {
    const { error } = await supabase
        .from("servicos")
        .delete()
        .eq("id", servico.id);
    if (error) throw error;
}

export async function atualizarServicosAssociados(clienteId: number, servicoIds: number[]) {
    await supabase.from("servicos_consumidos").delete().eq("cliente_id", clienteId);
    for (const servicoId of servicoIds) {
        await supabase.from("servicos_consumidos").insert([{ cliente_id: clienteId, servico_id: servicoId }]);
    }
}