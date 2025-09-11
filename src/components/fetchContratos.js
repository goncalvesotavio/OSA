import { supabase } from "../supabase/supabaseClient.jsx"

export async function fetchContrato (ano) {
    const { data, error } = await supabase
      .from('Contratos_armários')
      .select("Contrato")
      .eq("Ano", ano)

    if (error || !data) {
        console.error('Erro ao buscar contrato:', error)
        return []
    }

    return data
}

export async function infosCliente(id_cliente) {
    const { data, error } = await supabase
      .from('Clientes')
      .select(`
        Nome,
        Email,
        RM,
        Tipo_curso,
        Curso,
        Serie
        `)
      .eq('id_cliente', id_cliente)

    if (error || !data) {
        console.error('Erro ao buscar cliente:', error)
        return []
    }

    return data
}