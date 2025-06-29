import { supabase } from "./supabaseClient";

export async function cadastrarProduto({ nome, valor }: { nome: string, valor: number }) {
    const { data, error } = await supabase
        .from("produtos")
        .insert([{ nome, valor }])
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function listarProdutos() {
    const { data, error } = await supabase.from("produtos").select("*");
    if (error) throw error;
    return data;
}

export async function atualizarProduto(produto: any) {
    const { error } = await supabase
        .from("produtos")
        .update({ nome: produto.nome, valor: produto.valor })
        .eq("id", produto.id);
    if (error) throw error;
}

export async function excluirProduto(produto: any) {
    const { error } = await supabase
        .from("produtos")
        .delete()
        .eq("id", produto.id);
    if (error) throw error;
}

export async function atualizarProdutosAssociados(clienteId: number, produtoIds: number[]) {
    await supabase.from("produtos_consumidos").delete().eq("cliente_id", clienteId);
    for (const produtoId of produtoIds) {
        await supabase.from("produtos_consumidos").insert([{ cliente_id: clienteId, produto_id: produtoId }]);
    }
}
