import { supabase } from '../supabase/supabaseClient'; 

export async function adicionarCarrinhoTamanho({
  id_uniforme,
  tamanho,
  qtdSelecionado,
  adicionarAoCarrinho 
}) {
  const { data, error } = await supabase
    .from('Estoque_uniforme')
    .select('id_estoque')
    .eq('id_uniforme', id_uniforme)
    .eq('Tamanho', tamanho);

  if (error) {
    console.error('Erro ao buscar uniforme:', error);
    return;
  }

  if (!data || data.length === 0) {
    alert('Estoque não encontrado para esse tamanho.');
    return;
  }

  const quantidade = parseInt(qtdSelecionado);
  if (isNaN(quantidade) || quantidade <= 0) {
    alert('Selecione uma quantidade válida.');
    return;
  }

  const id_estoque = data[0].id_estoque;
  adicionarAoCarrinho(id_uniforme, id_estoque, quantidade);
}
