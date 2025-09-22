import { supabase } from '../supabase/supabaseClient.jsx'

export async function novaVendaUniforme(cliente, infos) {
    const { data, error } = await supabase
      .from('Vendas-2025')
      .insert([
        { id_cliente: cliente,
          Data: infos.data,
          Forma_de_pagamento: infos.formaPagamento,
          Pago: infos.pago,
          Total: infos.total,
          Compra_finalizada: infos.finalizada
        },
      ])
      .select(`id_venda`)
    
    if (error || !data) {
        console.log("Erro ao adicionar nova venda: ", error);
    }

    return data[0].id_venda
}

export async function detalhesVendaUniforme(infosDetalhes) {
    const { data, error } = await supabase
      .from('Vendas_uniformes')
      .insert([
        { id_venda: infosDetalhes.id_venda,
          id_uniforme: infosDetalhes.id_uniforme,
          Qtd: infosDetalhes.qtd,
          Tamanho: infosDetalhes.id_estoque,
          Preco_unitario: infosDetalhes.precoUnitario,
          Preco_total: infosDetalhes.precoTotal
        }
      ])

    if (error || !data) {
        console.log("Erro ao adicionar detalhes da venda: ", error);
    }
}

export async function estoque(infosDetalhes) {
  const { data, error } = await supabase
    .from('Estoque_uniforme')
    .select(`
      Tamanho,
      Qtd_estoque`)
    .eq('id_estoque', infosDetalhes.id_estoque)
    .single()

    return data
}

export async function editarEstoque(infosEstoque) {
  const { data, error } = await supabase
    .from('Estoque_uniforme')
    .upsert({ 
      id_estoque: infosEstoque.id_estoque,
      id_uniforme: infosEstoque.id_uniforme,
      Tamanho: infosEstoque.tamanho,
      Qtd_estoque: infosEstoque.novaQtd })

      if (error) {
    console.error('Erro ao editar estoque:', error.message);
  }
}

export async function detalhesVendaArmario(n_armario, id_venda, hora) {
  const { data, error } = await supabase
    .from('Vendas_armários')
    .insert([
      {N_armario: n_armario,
       id_venda: id_venda,
       Hora_compra: hora
      }
    ])
    .select('id')

    if (error) {
      console.error('Erro ao inserir armário:', error.message);
    }

    return data[0]?.id
}