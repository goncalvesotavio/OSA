import React, { createContext, useState, useEffect } from 'react';
import { qtdDisponivel } from '../components/fetchUniformes';

export const CarrinhoContext = createContext();

export const CarrinhoProvider = ({ children }) => {
    const [carrinho, setCarrinho] = useState({ uniformes: [], armarios: [] });

    useEffect(() => {
        const carrinhoSalvo = localStorage.getItem('carrinho');
        if (carrinhoSalvo) {
            const parsedCarrinho = JSON.parse(carrinhoSalvo);
            // Garante que a estrutura do carrinho seja sempre a correta
            if (parsedCarrinho.uniformes && parsedCarrinho.armarios) {
                setCarrinho(parsedCarrinho);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
    }, [carrinho]);

    // --- Funções para Uniformes ---
    const adicionarAoCarrinho = async (id_uniforme, id_estoque, quantidade) => {
        const itemExistente = carrinho.uniformes.find(item => item.id_estoque === id_estoque);
        if (itemExistente) {
            const novaQuantidade = itemExistente.quantidade + quantidade;
            const estoque = await qtdDisponivel(id_estoque);
            if (novaQuantidade > estoque.Qtd_estoque) {
                alert("Você atingiu o limite máximo do estoque");
                return;
            }
            setCarrinho(prev => ({
                ...prev,
                uniformes: prev.uniformes.map(item =>
                    item.id_estoque === id_estoque ? { ...item, quantidade: novaQuantidade } : item
                )
            }));
        } else {
            setCarrinho(prev => ({
                ...prev,
                uniformes: [...prev.uniformes, { id_uniforme, id_estoque, quantidade }]
            }));
        }
    };

    const removerDoCarrinho = (id_estoque) => {
        setCarrinho(prev => ({
            ...prev,
            uniformes: prev.uniformes.filter(item => item.id_estoque !== id_estoque)
        }));
    };

    const removerQuantidadeDoCarrinho = (id_estoque, quantidadeRemover = 1) => {
        setCarrinho(prev => ({
            ...prev,
            uniformes: prev.uniformes.map(item => {
                if (item.id_estoque === id_estoque) {
                    const novaQuantidade = item.quantidade - quantidadeRemover;
                    return novaQuantidade > 0 ? { ...item, quantidade: novaQuantidade } : null;
                }
                return item;
            }).filter(Boolean)
        }));
    };

    // --- Funções para Armários ---
    const adicionarArmario = (armarioInfo) => {
        const armariolocalizado = carrinho.armarios.find(a => a.numero === armarioInfo.numero);
        if (armariolocalizado) {
            alert("Este armário já está no seu carrinho.");
            return;
        }
        setCarrinho(prev => ({
            ...prev,
            armarios: [...prev.armarios, armarioInfo]
        }));
    };
    
    const removerArmario = (numeroArmario) => {
        setCarrinho(prev => ({
            ...prev,
            armarios: prev.armarios.filter(a => a.numero !== numeroArmario)
        }));
    };

    // --- Função Geral ---
    const limparCarrinho = () => {
        setCarrinho({ uniformes: [], armarios: [] });
        localStorage.removeItem('carrinho');
    };

    const atualizarArmario = (numero, novasInfos) => {
        setCarrinho(prev => ({
            ...prev,
            armarios: prev.armarios.map(armario =>
                armario.numero === numero
                ? { ...armario, ...novasInfos } // atualiza só o armário encontrado
                : armario // mantém os outros
            )
        }))
    }

    return (
        <CarrinhoContext.Provider value={{
            carrinho,
            adicionarAoCarrinho,
            removerDoCarrinho,
            removerQuantidadeDoCarrinho,
            adicionarArmario,
            removerArmario,
            limparCarrinho,
            atualizarArmario
        }}>
            {children}
        </CarrinhoContext.Provider>
    );
};
