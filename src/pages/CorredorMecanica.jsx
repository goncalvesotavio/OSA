import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import styles from '../styles/CorredorMecanica.module.css';
import { fetchArmarios } from '../components/fetchArmarios.jsx';
import logoOsa from '/osaCompleto.png';
import ModalArmario from '../components/ModalArmario';
import { CarrinhoContext } from '../context/CarrinhoContext';

export default function CorredorMecanica() {
    const isCartVisible = useOutletContext();
    const navigate = useNavigate();
    const { adicionarArmario } = useContext(CarrinhoContext);
    const [armariosDisponiveis, setArmariosDisponiveis] = useState([]);
    const [armarioSelecionado, setArmarioSelecionado] = useState(null);
    const [infoModal, setInfoModal] = useState(null);

    const secoesArmarios = [
        { secao: 29, titulo: 'Armário Nº29', armarios: Array.from({ length: 20 }, (_, i) => i + 473) },
        { secao: 30, titulo: 'Armário Nº30', armarios: Array.from({ length: 20 }, (_, i) => i + 493) },
        { secao: 31, titulo: 'Armário Nº31', armarios: Array.from({ length: 8 }, (_, i) => i + 513) },
        { secao: 32, titulo: 'Armário Nº32', armarios: Array.from({ length: 8 }, (_, i) => i + 521) },
        { secao: 33, titulo: 'Armário Nº33', armarios: Array.from({ length: 8 }, (_, i) => i + 529) }
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
        if (secao <= 30) return "17";
        if (secao <= 33) return "17 e 18";
        return "";
    };

    const handleArmarioClick = (numero, secao) => {
        setArmarioSelecionado(numero);
        setInfoModal({
            numero,
            secao,
            corredor: 'Mecânica',
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
                    <SecaoArmario secao={secoesArmarios[0]} />
                    <SecaoArmario secao={secoesArmarios[1]} />
                    <LinhaSala numero={17} />
                    <SecaoArmario secao={secoesArmarios[2]} />
                    <SecaoArmario secao={secoesArmarios[3]} />
                    <SecaoArmario secao={secoesArmarios[4]} />
                    <LinhaSala numero={18} />
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
