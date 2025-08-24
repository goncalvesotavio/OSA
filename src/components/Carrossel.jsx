import React, { useState, useEffect } from 'react';

const CarrosselCamisas = ({ imagens }) => {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    // Adiciona uma verificação para só iniciar o carrossel se houver imagens.
    if (!imagens || imagens.length === 0) {
      return;
    }

    const intervalo = setInterval(() => {
      setIndice(prev => (prev + 1) % imagens.length);
    }, 2000);

    return () => clearInterval(intervalo);
  }, [imagens]); // Altera a dependência para o array de imagens

  if (!imagens || imagens.length === 0) {
    return null;
  }

  return (
    <div>
      <img src={imagens[indice].Img} alt="Camisetas" className="icone-botao" />
    </div>
  );
};

const CarrosselCasacos = ({ imagens }) => {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    // Adiciona uma verificação para só iniciar o carrossel se houver imagens.
    if (!imagens || imagens.length === 0) {
      return;
    }

    const intervalo = setInterval(() => {
      setIndice(prev => (prev + 1) % imagens.length);
    }, 2000);

    return () => clearInterval(intervalo);
  }, [imagens]); // Altera a dependência para o array de imagens

  if (!imagens || imagens.length === 0) {
    return null;
  }

  return (
    <div>
      <img src={imagens[indice].Img} alt="Casacos" className="icone-botao" />
    </div>
  );
};

const CarrosselCalcas = ({ imagens }) => {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    // Adiciona uma verificação para só iniciar o carrossel se houver imagens.
    if (!imagens || imagens.length === 0) {
      return;
    }

    const intervalo = setInterval(() => {
      setIndice(prev => (prev + 1) % imagens.length);
    }, 2000);

    return () => clearInterval(intervalo);
  }, [imagens]); // Altera a dependência para o array de imagens

  if (!imagens || imagens.length === 0) {
    return null;
  }

  return (
    <div>
      <img src={imagens[indice].Img} alt="Calcas" className="icone-botao" />
    </div>
  );
};

export { CarrosselCamisas, CarrosselCasacos, CarrosselCalcas };
