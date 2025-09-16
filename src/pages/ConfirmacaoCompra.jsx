import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CarrinhoContext } from '../context/CarrinhoContext'; // Caminho corrigido
import { buscarDetalhesDoCarrinho } from '../components/fetchUniformes';
import styles from '../styles/ConfirmacaoCompra.module.css';
import logoOsa from '/osaCompleto.png';
import iconeArmario from '../assets/armarios.png'
import { ArquivoContext } from '../context/ArquivoContext';

export default function ConfirmacaoCompra() {
    const { carrinho } = useContext(CarrinhoContext);
    const [uniformesDetalhado, setUniformesDetalhado] = useState([]);
    const navigate = useNavigate()
    const { adicionarArmariosContext } = useContext(ArquivoContext)

    useEffect(() => {
        async function carregarDetalhes() {
            if (carrinho.uniformes.length > 0) {
                const detalhes = await buscarDetalhesDoCarrinho(carrinho.uniformes);
                setUniformesDetalhado(detalhes);
            }
        }
        carregarDetalhes();
    }, [carrinho.uniformes])

    const navegar = () => {
        if (carrinho.armarios.length > 0){
            navigate('/termos-de-uso')
        } else {
            navigate('/forma-pagamento')
        }
    }

    return (
        <div className={styles.paginaConfirmacao}>
            <button onClick={() => navigate(-1)} className={styles.botaoVoltar}>←</button>
            <h1 className={styles.cabecalho}>Confirmação de compra:</h1>
            <main className={styles.containerConfirmacao}>
                <h2>Você está comprando:</h2>
                <div className={styles.listaItens}>
                    {uniformesDetalhado.map(item => (
                        <div key={`uniforme-${item.id_estoque}`} className={styles.itemCard}>
                            <img src={item.Img} alt={item.Nome} className={styles.itemImagem} />
                            <div className={styles.itemDetalhes}>
                                <p className={styles.itemNome}>{item.Nome}</p>
                                <p className={styles.itemPreco}>R${item.Preço.toFixed(2)}</p>
                                <p className={styles.itemInfoAdicional}>Tamanho: {item.Tamanho} Quantidade: {item.quantidade}</p>
                            </div>
                        </div>
                    ))}
                    {carrinho.armarios.map(item => (
                        <div key={`armario-${item.numero}`} className={styles.itemCard}>
                            <img src={iconeArmario} alt={item.nome} className={styles.itemImagem} />
                            <div className={styles.itemDetalhes}>
                                <p className={styles.itemNome}>{item.nome}</p>
                                <p className={styles.itemPreco}>R${(item.preco || 50).toFixed(2)}</p>
                                <p className={styles.itemInfoAdicional}>Corredor: {item.corredor}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.botoesAcao}>
                    <button className={styles.botaoCancelar} onClick={() => navigate(-1)}>Cancelar</button>
                    <button className={styles.botaoOk} onClick={navegar}>Ok</button>
                </div>
            </main>
            <img src={logoOsa} alt="Logo OSA" className={styles.logoCanto} />
        </div>
    );
}
