import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import styles from '../styles/CorredorTres.module.css';
import { fetchArmarios } from '../components/fetchArmarios.jsx';
import logoOsa from '/osaCompleto.png';
import ModalArmario from '../components/ModalArmario';
import { CarrinhoContext } from '../context/CarrinhoContext';

export default function CorredorTres() {
    const isCartVisible = useOutletContext();
    const navigate = useNavigate();
    const { adicionarArmario } = useContext(CarrinhoContext);
    const [armariosDisponiveis, setArmariosDisponiveis] = useState([]);
    const [armarioSelecionado, setArmarioSelecionado] = useState(null);
    const [infoModal, setInfoModal] = useState(null);

    const secoesArmarios = [
        { secao: 23, titulo: 'Armário Nº23', armarios: Array.from({ length: 20 }, (_, i) => i + 369) },
        { secao: 24, titulo: 'Armário Nº24', armarios: Array.from({ length: 16 }, (_, i) => i + 389) },
        { secao: 25, titulo: 'Armário Nº25', armarios: Array.from({ length: 16 }, (_, i) => i + 405) },
        { secao: 26, titulo: 'Armário Nº26', armarios: Array.from({ length: 16 }, (_, i) => i + 421) },
        { secao: 27, titulo: 'Armário Nº27', armarios: Array.from({ length: 16 }, (_, i) => i + 437) },
        { secao: 28, titulo: 'Armário Nº28', armarios: Array.from({ length: 20 }, (_, i) => i + 453) }
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
        if (secao <= 24) return "13 e 14";
        if (secao <= 27) return "14 e 15";
        if (secao <= 28) return "15 e 16";
        return "";
    };

    const handleArmarioClick = (numero, secao) => {
        setArmarioSelecionado(numero);
        setInfoModal({
            numero,
            secao,
            corredor: '3',
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

            <div className={`${styles.gridContainer} ${isCartVisible ? styles.cartVisible : ''}`}>
                <div className={styles.sidebarContainer}>
                    <div className={styles.linhaConectora}></div>
                    <LinhaSala numero={13} />
                    <SecaoArmario secao={secoesArmarios[0]} />
                    <SecaoArmario secao={secoesArmarios[1]} />
                    <LinhaSala numero={14} />
                    <SecaoArmario secao={secoesArmarios[2]} />
                    <SecaoArmario secao={secoesArmarios[3]} />
                    <SecaoArmario secao={secoesArmarios[4]} />
                    <LinhaSala numero={15} />
                    <SecaoArmario secao={secoesArmarios[5]} />
                    <LinhaSala numero={16} />
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
