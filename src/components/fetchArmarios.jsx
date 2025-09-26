import { supabase } from "../supabase/supabaseClient"

export async function fetchArmarios() {
    const { data, error } = await supabase
      .from('Armários')
      .select('*')

    if (error || !data) {
        console.error('Erro ao buscar armários:', error);
        return [];
    }

    return data;
}

export async function detalheArmario(n_armario) {
    const { data, error } = await supabase
      .from('Armários')
      .select('*')
      .eq('Nº_armario', n_armario)

    if (error || !data) {
        console.error('Erro ao buscar armário:', error);
        return [];
    }

    return data;
}

export async function mudarArmario(n_armario) {
  const { data, error } = await supabase
  .from('Armários')
  .update({ Disponivel: false })
  .eq('N_armario', n_armario)

  if (error || !data) {
        console.error('Erro ao mudar armário:', error);
        return [];
    }
}

export async function procurarDatas(ano) {
  const { data, error } = await supabase
    .from('Contratos_armários')
    .select(`
      Data_anual,,
      Data_semestral
    `)
    .eq('Ano', ano)

  if (error) {
    console.error("Erro ao buscar datas: ", error)
  }

  return data
}