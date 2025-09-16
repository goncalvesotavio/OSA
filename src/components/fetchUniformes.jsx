import React, { useState, useEffect } from "react";
import { supabase } from '../supabase/supabaseClient.jsx'

export async function fetchUniformes() {
  const { data, error } = await supabase
    .from('Uniformes')
    .select(`
      id_uniforme,
      Nome,
      Img,
      Preço,
      Estoque_uniforme(Qtd_estoque)
    `)

  if (error || !data) {
    console.error('Erro ao buscar uniformes:', error);
    return [];
  }

  const produtos = data.map(item => {
    const totalEstoque = item.Estoque_uniforme
      ? item.Estoque_uniforme.reduce((soma, e) => soma + e.Qtd_estoque, 0)
      : 0;

    return {
      ...item,
      esgotado: totalEstoque <= 0,
    }
  })

  return produtos
}

export async function Camisas() {
  const { data, error } = await supabase
    .from('Uniformes')
    .select(`
        id_uniforme,
        Nome,
        Img,
        Preço,
        Categoria,
        Estoque_uniforme(Qtd_estoque)
      `)
    .eq('Categoria', 'Camiseta');

  if (error || !data) {
    console.error('Erro ao buscar uniformes:', error);
    return [];
  }

  const produtos = data.map(item => {
    const totalEstoque = item.Estoque_uniforme
      ? item.Estoque_uniforme.reduce((soma, e) => soma + e.Qtd_estoque, 0)
      : 0;

    return {
      ...item,
      esgotado: totalEstoque <= 0,
    };
  });

  return produtos;
}

export async function Casacos() {
  const { data, error } = await supabase
    .from('Uniformes')
    .select(`
        id_uniforme,
        Nome,
        Img,
        Preço,
        Categoria,
        Estoque_uniforme(Qtd_estoque)
      `)
    .eq('Categoria', 'Casaco');

  if (error || !data) {
    console.error('Erro ao buscar uniformes:', error);
    return [];
  }

  const produtos = data.map(item => {
    const totalEstoque = item.Estoque_uniforme
      ? item.Estoque_uniforme.reduce((soma, e) => soma + e.Qtd_estoque, 0)
      : 0;

    return {
      ...item,
      esgotado: totalEstoque <= 0,
    };
  });

  return produtos;
}

export async function Calcas() {
  const { data, error } = await supabase
    .from('Uniformes')
    .select(`
        id_uniforme,
        Nome,
        Img,
        Preço,
        Categoria,
        Estoque_uniforme(Qtd_estoque)
      `)
    .eq('Categoria', 'Calca');

  if (error || !data) {
    console.error('Erro ao buscar uniformes:', error);
    return [];
  }

  const produtos = data.map(item => {
    const totalEstoque = item.Estoque_uniforme
      ? item.Estoque_uniforme.reduce((soma, e) => soma + e.Qtd_estoque, 0)
      : 0;

    return {
      ...item,
      esgotado: totalEstoque <= 0,
    };
  });

  return produtos;
}

export async function detalheUniforme(id_uniforme) {
  const { data, error } = await supabase
    .from('Uniformes')
    .select(`
        id_uniforme,
        Nome,
        Img,
        Preço,
        Descricao,
        Estoque_uniforme(Qtd_estoque, Tamanho)
      `)
    .eq('id_uniforme', id_uniforme);

  if (error) {
    console.error('Erro ao buscar uniformes:', error);
  }

  if (!data || data.length === 0) return null;

  const uniforme = data[0];

  const sizeOrder = ['P', 'M', 'G', 'GG', 'XG'];

  const tamanhos = uniforme.Estoque_uniforme
    .map(estoque => estoque.Tamanho)
    .sort((a, b) => {
      const indexA = sizeOrder.indexOf(a);
      const indexB = sizeOrder.indexOf(b);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

  const tamanhosDisponiveis = uniforme.Estoque_uniforme
    .filter(estoque => estoque.Qtd_estoque > 0)
    .map(estoque => estoque.Tamanho);

  const qtdDisponivel = uniforme.Estoque_uniforme
    .filter(estoque => estoque.Qtd_estoque > 0)
    .map(estoque => ({
      tamanho: estoque.Tamanho,
      quantidade: estoque.Qtd_estoque
    }));

  const totalEstoque = uniforme.Estoque_uniforme
    ? uniforme.Estoque_uniforme.reduce((soma, e) => soma + e.Qtd_estoque, 0)
    : 0;

  return {
    ...uniforme,
    tamanhosDisponiveis,
    tamanhos,
    qtdDisponivel,
    esgotado: totalEstoque <= 0
  };
}

export async function qtdDisponivel(id_estoque) {
  const { data, error } = await supabase
    .from('Estoque_uniforme')
    .select(`
      id_estoque,
      Qtd_estoque
      `)
    .eq('id_estoque', id_estoque);

  const qtdDisponivel = data[0]

  return qtdDisponivel;
}

export async function buscarUniformesPorIds(ids) {
  if (!ids || ids.length === 0) return [];

  const { data, error } = await supabase
    .from('Uniformes')
    .select(`
      id_uniforme,
      Nome,
      Img,
      Preço,
      Estoque_uniforme(Qtd_estoque)
    `)
    .in('id_uniforme', ids);

  if (error) {
    console.error('Erro ao buscar uniformes por ids:', error);
    return [];
  }

  const produtos = data.map(item => {
    const totalEstoque = item.Estoque_uniforme
      ? item.Estoque_uniforme.reduce((soma, e) => soma + e.Qtd_estoque, 0)
      : 0;

    return {
      ...item,
      esgotado: totalEstoque <= 0,
    };
  });

  return produtos;
}

export async function buscarImagens(id_uniforme) {

  console.log('Buscando imagens com id_uniforme:', id_uniforme);

  const { data, error } = await supabase
    .from('Imagens')
    .select(`
          Imagem,
          id_uniforme
        `)
    .eq('id_uniforme', id_uniforme);

  if (error) {
    console.error('Erro ao buscar imagens de uniformes por id:', error);
    return [];
  }

  return data;
}

export async function buscarDetalhesDoCarrinho(carrinho) {
  if (!carrinho || carrinho.length === 0) {
    return [];
  }

  const idsUniformes = [...new Set(carrinho.map(item => item.id_uniforme))];

  const { data: produtos, error } = await supabase
    .from('Uniformes')
    .select(`
            id_uniforme,
            Nome,
            Img,
            Preço,
            Estoque_uniforme (
                id_estoque,
                Tamanho
            )
        `)
    .in('id_uniforme', idsUniformes);

  if (error) {
    console.error('Erro ao buscar detalhes dos produtos do carrinho:', error);
    return [];
  }

  const carrinhoDetalhado = carrinho.map(itemCarrinho => {
    const produtoInfo = produtos.find(p => p.id_uniforme === itemCarrinho.id_uniforme);
    if (!produtoInfo) return null;

    const estoqueInfo = produtoInfo.Estoque_uniforme.find(e => e.id_estoque === itemCarrinho.id_estoque);
    if (!estoqueInfo) return null;

    return {
      ...itemCarrinho,
      Nome: produtoInfo.Nome,
      Img: produtoInfo.Img,
      Preço: produtoInfo.Preço,
      Tamanho: estoqueInfo.Tamanho
    };
  }).filter(Boolean);

  return carrinhoDetalhado;
}
