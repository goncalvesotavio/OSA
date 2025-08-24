import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CarrinhoContext } from '../context/CarrinhoContext';
import { buscarDetalhesDoCarrinho } from '../components/fetchUniformes';
import styles from '../styles/VisualizarCarrinho.module.css'; 
import iconeArmario from '../assets/armarios.png';

export default function VisualizarCarrinho() {
    const { carrinho, removerDoCarrinho, adicionarAoCarrinho, removerQuantidadeDoCarrinho, removerArmario } = useContext(CarrinhoContext);
    const [uniformesDetalhado, setUniformesDetalhado] = useState([]);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    // Efeito para buscar os detalhes dos uniformes quando eles mudam no carrinho
    useEffect(() => {
        async function carregarDetalhesUniformes() {
            if (carrinho.uniformes.length > 0) {
                const detalhes = await buscarDetalhesDoCarrinho(carrinho.uniformes);
                setUniformesDetalhado(detalhes);
            } else {
                setUniformesDetalhado([]);
            }
        }
        carregarDetalhesUniformes();
    }, [carrinho.uniformes]);

    // Efeito para recalcular o total quando os itens detalhados ou os armários mudam
    useEffect(() => {
        const totalUniformes = uniformesDetalhado.reduce((acc, item) => acc + (item.Preço * item.quantidade), 0);
        const totalArmarios = carrinho.armarios.reduce((acc, item) => acc + (item.preco || 90), 0);
        setTotal(totalUniformes + totalArmarios);
    }, [uniformesDetalhado, carrinho.armarios]);

    if (carrinho.uniformes.length === 0 && carrinho.armarios.length === 0) {
        return (
            <div className={styles.carrinhoVazio}>
                <h1>Seu carrinho está vazio</h1>
                <button onClick={() => navigate('/inicio')} className={styles.botaoVoltarLoja}>
                    Voltar para o início
                </button>
            </div>
        );
    }

    return (
        <div className={styles.paginaCarrinho}>
            <button onClick={() => navigate(-1)} className={styles.botaoVoltar}>←</button>
            <header className={styles.cabecalhoCarrinho}>
                <h1>Meu Carrinho</h1>
            </header>
            <main className={styles.listaItens}>
                {uniformesDetalhado.map(item => (
                    <div key={`uniforme-${item.id_estoque}`} className={styles.itemCard}>
                        <img src={item.Img} alt={item.Nome} className={styles.itemImagem} />
                        <div className={styles.itemDetalhes}>
                            <p className={styles.itemNome}>{item.Nome}</p>
                            <p className={styles.itemPreco}>R${item.Preço.toFixed(2)}</p>
                            <p className={styles.itemInfoAdicional}>Tamanho: {item.Tamanho}</p>
                            <div className={styles.itemControlesQtd}>
                                <button onClick={() => removerQuantidadeDoCarrinho(item.id_estoque, 1)} className={styles.botaoQtd}>-</button>
                                <span>{item.quantidade}</span>
                                <button onClick={() => adicionarAoCarrinho(item.id_uniforme, item.id_estoque, 1)} className={styles.botaoQtd}>+</button>
                            </div>
                        </div>
                        <button onClick={() => removerDoCarrinho(item.id_estoque)} className={styles.itemRemoverBtn}>🗑️</button>
                    </div>
                ))}
                {carrinho.armarios.map(item => (
                    <div key={`armario-${item.numero}`} className={styles.itemCard}>
                        <img src={iconeArmario} alt={item.nome} className={styles.itemImagem} />
                        <div className={styles.itemDetalhes}>
                            <p className={styles.itemNome}>{item.nome}</p>
                            <p className={styles.itemPreco}>R${(item.preco || 90).toFixed(2)}</p>
                            <p className={styles.itemInfoAdicional}>Corredor: {item.corredor}</p>
                        </div>
                        <button onClick={() => removerArmario(item.numero)} className={styles.itemRemoverBtn}>🗑️</button>
                    </div>
                ))}
            </main>
            <footer className={styles.rodapeCarrinho}>
                <div className={styles.totalInfo}>
                    <p>Seu carrinho tem um total de:</p>
                    <p className={styles.totalPreco}>R${total.toFixed(2)}</p>
                </div>
                <button className={styles.botaoPagarCarrinho} onClick={() => navigate('/informacoes')}>
                    Pagar!
                </button>
            </footer>
        </div>
    );
}
