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

export async function salvarArquivo(file) {
  const { data, error } = await supabase
    .storage
    .from("arquivos/Alunos")
    .upload(`Contrato_Aramario_2025.pdf`, file)
    showOverlay.value = false

    if (error) {
      console.log('Erro ao baixar PDF: ', error)
      return null
    }

    return Image.Url.value = URL .createObjectURL(file)
}

export async function salvarURL(id_vendaArmario, url){
  const { data, error } = await supabase
    .from("Vendas_armarios")
    .update([
      {Contrato: url}
    ])
    .eq('id', id_vendaArmario)

    if (error) {
      console.log('Erro ao incerir PDF: ', error)
      return null
    }
}