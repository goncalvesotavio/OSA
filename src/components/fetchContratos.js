import { supabase } from "../supabase/supabaseClient.jsx"

export async function fetchContrato (ano) {
    const { data, error } = await supabase
      .from('Contratos_armários')
      .select("Contrato")
      .eq("Ano", ano)

    if (error || !data) {
        console.error('Erro ao buscar contrato:', error);
        return [];
    }

    return data
}