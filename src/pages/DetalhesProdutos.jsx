import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CarrinhoContext } from '../context/CarrinhoContext';
import { detalheUniforme, buscarImagens } from '../components/fetchUniformes.jsx';
import { adicionarCarrinhoTamanho } from '../components/addCarrinho.jsx';
import styles from '../styles/DetalhesProdutos.module.css';

export default function DetalhesProdutos() {
  const [uniforme, setUniforme] = useState(null);
  const { id_uniforme } = useParams();
  const navigate = useNavigate();
  const { adicionarAoCarrinho } = useContext(CarrinhoContext);
  const [tamanho, setTamanho] = useState('');
  const [qtdSelecionado, setQtdSelecionado] = useState(1);
  const [imgs, setImgs] = useState([]);
  const [indiceImagemAtual, setIndiceImagemAtual] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [produtoEsgotado, setProdutoEsgotado] = useState(false);
  const [qtd, setQtd] = useState([]);
  const [esgotado, setEsgotado] = useState(false);

  useEffect(() => {
    async function carregarUniforme() {
      const produto = await detalheUniforme(id_uniforme);
      setUniforme(produto);
      if (produto) {
        if (produto.esgotado) {
          setProdutoEsgotado(true);
        }
      }
    }
    carregarUniforme();
  }, [id_uniforme]);

  useEffect(() => {
    if (!id_uniforme) return;
    async function buscarImagensId() {
      const imgsData = await buscarImagens(id_uniforme);
      setImgs(imgsData);
    }
    buscarImagensId();
  }, [id_uniforme]);

  const handleAdicionarCarrinho = () => {
    if (!tamanho) {
      setFeedback("Por favor, selecione um tamanho!");
      setTimeout(() => setFeedback(''), 3000);
      return;
    }
    adicionarCarrinhoTamanho({
      id_uniforme: uniforme.id_uniforme,
      tamanho,
      qtdSelecionado,
      adicionarAoCarrinho,
    });
    setFeedback(`${qtdSelecionado} item(s) adicionado(s) ao carrinho!`);
    setTimeout(() => setFeedback(''), 3000);
  };

  const proximo = () => {
    if (indiceImagemAtual < imgs.length - 1) {
      setIndiceImagemAtual(indiceImagemAtual + 1);
    }
  };

  const anterior = () => {
    if (indiceImagemAtual > 0) {
      setIndiceImagemAtual(indiceImagemAtual - 1);
    }
  };

  if (!uniforme) {
    return <div>Carregando...</div>;
  }

  const tamanhoEsgotado = (tamanhoSelecionado) => {
    const isDisponivel = uniforme.tamanhosDisponiveis.includes(tamanhoSelecionado);
    setEsgotado(!isDisponivel);
    setTamanho(tamanhoSelecionado);
    if (isDisponivel) {
      obterQtd(tamanhoSelecionado);
    } else {
      setQtd([]);
    }
  };

  const obterQtd = (tamanhoSelecionado) => {
    const item = uniforme.qtdDisponivel.find(e => e.tamanho === tamanhoSelecionado);
    if (item) {
      const arrayQtd = Array.from({ length: item.quantidade }, (_, i) => i + 1);
      setQtd(arrayQtd);
    } else {
      setQtd([]);
    }
  };

  return (
    <>
      <button onClick={() => navigate('/uniformes')} className={styles.botaoVoltar}>←</button>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.imagemWrapper}>
            {produtoEsgotado && <div className={styles.avisoProdutoEsgotado}>ESGOTADO</div>}
            <button onClick={anterior} className={`${styles.navArrow} ${styles.prev}`} disabled={indiceImagemAtual === 0}>&#8249;</button>
            <img
              src={imgs[indiceImagemAtual]?.Imagem || uniforme.Img}
              className={styles.imagemCamisa}
              alt={uniforme.Nome}
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x600/ccc/333?text=Imagem+Indisponível'; }}
            />
            <button onClick={proximo} className={`${styles.navArrow} ${styles.next}`} disabled={indiceImagemAtual >= imgs.length - 1}>&#8250;</button>
          </div>
          <div className={styles.cardContent}>
            <h1 className={styles.nome}>{uniforme.Nome}</h1>
            <p className={styles.preco}>R${uniforme.Preço.toFixed(2)}</p>
            <p className={styles.descricao}>{uniforme.Descricao}</p>
            <div className={styles.tamanhosContainer}>
              {uniforme?.tamanhos?.map(tam => {
                const isDisponivel = uniforme.tamanhosDisponiveis.includes(tam);
                return (
                  <div key={tam} className={styles.wrapper}>
                    <input
                      type="radio"
                      id={`tamanho-${tam}`}
                      name="tamanho"
                      value={tam}
                      checked={tamanho === tam}
                      onChange={(e) => tamanhoEsgotado(e.target.value)}
                      className={styles.input}
                      disabled={!isDisponivel}
                    />
                    <label htmlFor={`tamanho-${tam}`} className={`${styles.label} ${!isDisponivel ? styles.esgotado : ''}`}>
                      {tam}
                    </label>
                  </div>
                );
              })}
            </div>
            <div className={styles.acoes}>
              <select
                className={styles.qtd}
                value={qtdSelecionado}
                onChange={(e) => setQtdSelecionado(parseInt(e.target.value))}
                disabled={!tamanho || esgotado}
              >
                {qtd.map(n => (<option key={n} value={n}>{n}</option>))}
              </select>
              <button
                className={styles.botao}
                onClick={handleAdicionarCarrinho}
                disabled={produtoEsgotado || !tamanho}
              >
                ADICIONAR AO CARRINHO!
              </button>
            </div>
            {feedback && <p className={styles.feedback}>{feedback}</p>}
          </div>
        </div>
      </div>
      {/* A BarraCarrinho foi removida daqui */}
    </>
  );
}
