import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom'; // 1. Importe o useOutletContext
import styles from '../styles/CorredorUm.module.css';
import { fetchArmarios } from '../components/fetchArmarios.jsx';
import logoOsa from '/osaCompleto.png';
import ModalArmario from '../components/ModalArmario';
import { CarrinhoContext } from '../context/CarrinhoContext';

export default function CorredorUm() {
    const isCartVisible = useOutletContext(); // 2. Recebe o estado do Layout
    const navigate = useNavigate();
    const { adicionarArmario } = useContext(CarrinhoContext);
    const [armariosDisponiveis, setArmariosDisponiveis] = useState([]);
    const [armarioSelecionado, setArmarioSelecionado] = useState(null);
    const [infoModal, setInfoModal] = useState(null);

    const secoesArmarios = [
        { secao: 1, titulo: 'Armário Nº1', armarios: Array.from({ length: 20 }, (_, i) => i + 1) },
        { secao: 2, titulo: 'Armário Nº2', armarios: Array.from({ length: 16 }, (_, i) => i + 21) },
        { secao: 3, titulo: 'Armário Nº3', armarios: Array.from({ length: 16 }, (_, i) => i + 37) },
        { secao: 4, titulo: 'Armário Nº4', armarios: Array.from({ length: 16 }, (_, i) => i + 53) },
        { secao: 5, titulo: 'Armário Nº5', armarios: Array.from({ length: 16 }, (_, i) => i + 69) },
        { secao: 6, titulo: 'Armário Nº6', armarios: Array.from({ length: 20 }, (_, i) => i + 85) },
        { secao: 7, titulo: 'Armário Nº7', armarios: Array.from({ length: 16 }, (_, i) => i + 105) },
        { secao: 8, titulo: 'Armário Nº8', armarios: Array.from({ length: 16 }, (_, i) => i + 121) },
        { secao: 9, titulo: 'Armário Nº9', armarios: Array.from({ length: 16 }, (_, i) => i + 137) },
        { secao: 10, titulo: 'Armário Nº10', armarios: Array.from({ length: 16 }, (_, i) => i + 153) },
        { secao: 11, titulo: 'Armário Nº11', armarios: Array.from({ length: 20 }, (_, i) => i + 169) },
        { secao: 12, titulo: 'Armário Nº12', armarios: Array.from({ length: 16 }, (_, i) => i + 189) }
    ];

    useEffect(() => {
        const carregarStatusArmarios = async () => {
            const data = await fetchArmarios();
            const disponiveis = data.filter(a => a.Disponivel).map(a => a.N_armario);
            setArmariosDisponiveis(disponiveis);
        };
        carregarStatusArmarios();
    }, []);

    const isArmarioDisponivel = (numero) => armariosDisponiveis.includes(numero);

    const getSalaInfo = (secao) => {
        if (secao <= 2) return "1 e 2";
        if (secao <= 5) return "2 e 3";
        if (secao <= 7) return "3 e 4";
        if (secao === 8) return "4 e 5";
        if (secao <= 10) return "5 e 6";
        if (secao <= 12) return "6 e 7";
        return "";
    };

    const handleArmarioClick = (numero, secao) => {
        setArmarioSelecionado(numero);
        setInfoModal({
            numero,
            secao,
            corredor: '1',
            salaInfo: getSalaInfo(secao)
        });
    };

    const handleConfirmarCompra = () => {
        const armarioParaAdicionar = {
            numero: infoModal.numero,
            secao: infoModal.secao,
            corredor: infoModal.corredor,
            salaInfo: infoModal.salaInfo,
            preco: 100.00,
            nome: `Armário Nº${infoModal.numero}`
        };
        adicionarArmario(armarioParaAdicionar);
        navigate(`/armario-adicionado/${infoModal.numero}`);
    };

    const handleCancelar = () => {
        setInfoModal(null);
        setArmarioSelecionado(null);
    };

    const SecaoArmario = ({ secao }) => (
        <div className={styles.linhaCorredor}>
            <div className={styles.sidebarEspaco}></div>
            <div className={styles.secaoArmario}>
                <h2>{secao.titulo}</h2>
                <div className={styles.gridArmarios}>
                    {secao.armarios.map(num => (
                        <button
                            key={num}
                            className={`${styles.botaoArmario} ${armarioSelecionado === num ? styles.selecionado : ''}`}
                            onClick={() => handleArmarioClick(num, secao.secao)}
                            disabled={!isArmarioDisponivel(num)}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    const LinhaSala = ({ numero }) => (
        <div className={styles.linhaCorredor}>
            <div className={styles.sidebarNumeroContainer}>
                <div className={styles.sidebarNumero}>
                    <span>SALA</span>
                    <span>{numero}</span>
                </div>
            </div>
            <div className={styles.secaoEspaco}></div>
        </div>
    );

    return (
        <div className={styles.paginaCorredor}>
            <button onClick={() => navigate(-1)} className={styles.botaoVoltar}>←</button>
            <h1 className={styles.titulo}>Selecione o armário desejado:</h1>

            {/* 3. Aplica a classe dinâmica */}
            <div className={`${styles.gridContainer} ${isCartVisible ? styles.cartVisible : ''}`}>
                <div className={styles.sidebarContainer}>
                    <div className={styles.linhaConectora}></div>
                    <LinhaSala numero={1} />
                    <SecaoArmario secao={secoesArmarios[0]} />
                    <SecaoArmario secao={secoesArmarios[1]} />
                    <LinhaSala numero={2} />
                    <SecaoArmario secao={secoesArmarios[2]} />
                    <SecaoArmario secao={secoesArmarios[3]} />
                    <SecaoArmario secao={secoesArmarios[4]} />
                    <LinhaSala numero={3} />
                    <SecaoArmario secao={secoesArmarios[5]} />
                    <SecaoArmario secao={secoesArmarios[6]} />
                    <LinhaSala numero={4} />
                    <SecaoArmario secao={secoesArmarios[7]} />
                    <LinhaSala numero={5} />
                    <SecaoArmario secao={secoesArmarios[8]} />
                    <SecaoArmario secao={secoesArmarios[9]} />
                    <LinhaSala numero={6} />
                    <SecaoArmario secao={secoesArmarios[10]} />
                    <SecaoArmario secao={secoesArmarios[11]} />
                    <LinhaSala numero={7} />
                </div>
            </div>

            <img src={logoOsa} alt="Logo OSA" className={styles.logoCanto} />
            <ModalArmario
                armario={infoModal}
                onConfirm={handleConfirmarCompra}
                onCancel={handleCancelar}
            />
        </div>
    );
}
