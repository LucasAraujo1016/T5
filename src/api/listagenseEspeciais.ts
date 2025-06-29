import { supabase } from "./supabaseClient";

export async function BuscarMaisConsumidos() {
    const { data, error } = await supabase
        .rpc('mais_consumidos_geral');
    if (error) {
        throw error
    }
    return(data || []);
};

export async function BuscarMaisConsumidosPorGenero(genero: "masculino" | "feminino") {
    const { data, error } = await supabase
        .rpc('mais_consumidos_por_genero_filtrado', { genero_param: genero });
        console.log(data)
    if (error) {
        throw error;
    }
    return (data || []);
}