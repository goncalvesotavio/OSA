import React, { useState, useEffect } from 'react';
import '../styles/TelaInicialUniformes.css';
import { useNavigate } from 'react-router-dom';
import { fetchUniformes, Camisas, Casacos, Calcas } from '../components/fetchUniformes.jsx';
import { CarrosselCamisas, CarrosselCasacos, CarrosselCalcas } from '../components/Carrossel.jsx';

export default function TelaInicialUniformes() {
  const [uniformes, setUniformes] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('todos');
  const navigate = useNavigate();
  const [imgCamisas, setImgCamisas] = useState([]);
  const [imgCasacos, setImgCasacos] = useState([]);
  const [imgCalcas, setImgCalcas] = useState([]);

  const carregarTodos = async () => {
    const produtos = await fetchUniformes();
    setUniformes(produtos);
    setTitulo("Todos os uniformes:");
    setCategoriaSelecionada('todos');
  };

  useEffect(() => {
    carregarTodos();
  }, []);

  useEffect(() => {
    const carregarImgCamisas = async () => {
      const resultado = await Camisas();
      if (resultado && resultado.length > 0) {
        setImgCamisas(resultado);
      }
    };
    carregarImgCamisas();
  }, []);

  useEffect(() => {
    const carregarImgCasacos = async () => {
      const resultado = await Casacos();
      if (resultado && resultado.length > 0) {
        setImgCasacos(resultado);
      }
    };
    carregarImgCasacos();
  }, []);

  useEffect(() => {
    const carregarImgCalcas = async () => {
      const resultado = await Calcas();
      if (resultado && resultado.length > 0) {
        setImgCalcas(resultado);
      }
    };
    carregarImgCalcas();
  }, []);

  const clickId = (id_uniforme) => {
    navigate(`/uniforme/${id_uniforme}`);
  };

  const clickCamiseta = async () => {
    const produtos = await Camisas();
    setUniformes(produtos);
    setTitulo("Camisas:");
    setCategoriaSelecionada('camisetas');
  };

  const clickCasaco = async () => {
    const produtos = await Casacos();
    setUniformes(produtos);
    setTitulo("Agasalhos:");
    setCategoriaSelecionada('agasalhos');
  };

  const clickCalca = async () => {
    const produtos = await Calcas();
    setUniformes(produtos);
    setTitulo("Calças e Shorts:");
    setCategoriaSelecionada('calcas');
  };

  return (
    <div className="container-uniformes">
      <button className="botao-voltar-uniformes" onClick={() => navigate('/inicio')}>←</button>
      <div className="container">
        <aside className="menu">
          <button className={`menu-item ${categoriaSelecionada === 'todos' ? 'selected' : ''}`} onClick={carregarTodos}>
            Todos
          </button>
          <button className={`menu-item ${categoriaSelecionada === 'camisetas' ? 'selected' : ''}`} onClick={clickCamiseta}>
            <CarrosselCamisas imagens={imgCamisas} />
            Camisetas
          </button>
          <button className={`menu-item ${categoriaSelecionada === 'agasalhos' ? 'selected' : ''}`} onClick={clickCasaco}>
            <CarrosselCasacos imagens={imgCasacos} />
            Agasalhos
          </button>
          <button className={`menu-item ${categoriaSelecionada === 'calcas' ? 'selected' : ''}`} onClick={clickCalca}>
            <CarrosselCalcas imagens={imgCalcas} />
            Calças e Shorts
          </button>
        </aside>

        <main className="conteudo">
          <h1 className="titulo">{titulo}</h1>
          <div className="grid">
            {(uniformes || []).map((p, index) => (
              <button key={index} className="card" onClick={() => clickId(p.id_uniforme)}>
                {p.esgotado && <span className="tag">Esgotado</span>}
                <img src={p.Img} className="imagem" alt={p.Nome} />
                <p className="nome">{p.Nome}</p>
                <p className="preco">R${p.Preço.toFixed(2)}</p>
              </button>
            ))}
          </div>
        </main>
        {/* A BarraCarrinho foi removida daqui */}
      </div>
    </div>
  );
}
