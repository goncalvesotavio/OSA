import React, { useContext } from 'react';
import { CarrinhoContext } from '../context/CarrinhoContext';
import { useNavigate } from 'react-router-dom';
import '../styles/BarraCarrinho.css';
import iconeArmario from '../assets/armarios.png';

export default function BarraCarrinho({ produtosUniformes }) {
  const { carrinho, adicionarAoCarrinho, removerDoCarrinho, removerQuantidadeDoCarrinho, removerArmario } = useContext(CarrinhoContext);
  const navigate = useNavigate();

  const totalUniformes = carrinho.uniformes.reduce((acc, item) => {
    const produto = produtosUniformes.find(p => p.id_uniforme === item.id_uniforme);
    return acc + (produto ? produto.Preço * item.quantidade : 0);
  }, 0);

  const totalArmarios = carrinho.armarios.reduce((acc, item) => acc + (item.preco || 90), 0); // Preço atualizado

  const total = totalUniformes + totalArmarios;

  return (
    <div className="barra-carrinho">
      <div className="itens">
        {carrinho.uniformes.map((item) => {
          const produto = produtosUniformes.find(p => p.id_uniforme === item.id_uniforme);
          if (!produto) return null;
          return (
            <div key={`uniforme-${item.id_estoque}`} className="item-carrinho">
              <img src={produto.Img} alt={produto.Nome} className="img-produto" />
              <div className="info">
                <p className="info-nome">{produto.Nome}</p>
                <p className="info-preco">R${produto.Preço.toFixed(2)}</p>
              </div>
              <div className="controles-item">
                <button onClick={() => removerQuantidadeDoCarrinho(item.id_estoque, 1)} className="botao-controle">－</button>
                <span>{item.quantidade}</span>
                <button onClick={() => adicionarAoCarrinho(item.id_uniforme, item.id_estoque, 1)} className="botao-controle">＋</button>
                <button onClick={() => removerDoCarrinho(item.id_estoque)} className="botao-remover">🗑️</button>
              </div>
            </div>
          );
        })}
        {carrinho.armarios.map((item) => (
          <div key={`armario-${item.numero}`} className="item-carrinho">
            <img src={iconeArmario} alt={item.nome} className="img-produto" />
            <div className="info">
              <p className="info-nome">{item.nome}</p>
              <p className="info-preco">R${(item.preco || 100).toFixed(2)}</p>
            </div>
            <div className="controles-item">
              <button onClick={() => removerArmario(item.numero)} className="botao-remover">🗑️</button>
            </div>
          </div>
        ))}
      </div>

      <div className="resumo-e-acoes">
        <div className="acoes-carrinho">
          <button className="botao-visualizar" onClick={() => navigate('/carrinho')}>
            Visualizar
          </button>
          <button className="botao-pagar" onClick={() => navigate('/informacoes')}>
            Pagar!
          </button>
        </div>
        <div className="resumo-total">
          <p>Total</p>
          <p><strong>R$ {total.toFixed(2)}</strong></p>
        </div>
      </div>
    </div>
  );
}
