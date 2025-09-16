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

export async function salvarArquivo(file, nomeArquivo) {
  try {
    const filePath = `Alunos/${nomeArquivo}`; // caminho dentro do bucket

    // Faz upload
    const { error: uploadError } = await supabase.storage
      .from("arquivos")
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    // Cria URL pública
    const { data } = supabase.storage.from("arquivos").getPublicUrl(filePath);
    const publicUrl = data.publicUrl;

    console.log("Arquivo salvo com sucesso:", publicUrl);
    return publicUrl;
  } catch (err) {
    console.error("Erro ao salvar arquivo:", err);
    return null;
  }
}

export async function salvarURL(id, arquivoPDF) {
  const { data, error } = await supabase
    .from('Vendas_armários')
    .update([{Contrato: arquivoPDF}])
    .eq('id', id)

    if (error) {
      console.error('Erro ao salvar URL: ', error)
      return null
    }
}