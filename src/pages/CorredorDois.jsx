import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import styles from '../styles/CorredorDois.module.css';
import { fetchArmarios } from '../components/fetchArmarios.jsx';
import logoOsa from '/osaCompleto.png';
import ModalArmario from '../components/ModalArmario';
import { CarrinhoContext } from '../context/CarrinhoContext';

export default function CorredorDois() {
    const isCartVisible = useOutletContext();
    const navigate = useNavigate();
    const { adicionarArmario } = useContext(CarrinhoContext);
    const [armariosDisponiveis, setArmariosDisponiveis] = useState([]);
    const [armarioSelecionado, setArmarioSelecionado] = useState(null);
    const [infoModal, setInfoModal] = useState(null);

    const secoesArmarios = [
        { secao: 13, titulo: 'Armário Nº13', armarios: Array.from({ length: 16 }, (_, i) => i + 205) },
        { secao: 14, titulo: 'Armário Nº14', armarios: Array.from({ length: 16 }, (_, i) => i + 221) },
        { secao: 15, titulo: 'Armário Nº15', armarios: Array.from({ length: 20 }, (_, i) => i + 237) },
        { secao: 16, titulo: 'Armário Nº16', armarios: Array.from({ length: 16 }, (_, i) => i + 257) },
        { secao: 17, titulo: 'Armário Nº17', armarios: Array.from({ length: 16 }, (_, i) => i + 273) },
        { secao: 18, titulo: 'Armário Nº18', armarios: Array.from({ length: 16 }, (_, i) => i + 289) },
        { secao: 19, titulo: 'Armário Nº19', armarios: Array.from({ length: 16 }, (_, i) => i + 305) },
        { secao: 20, titulo: 'Armário Nº20', armarios: Array.from({ length: 16 }, (_, i) => i + 321) },
        { secao: 21, titulo: 'Armário Nº21', armarios: Array.from({ length: 16 }, (_, i) => i + 337) },
        { secao: 22, titulo: 'Armário Nº22', armarios: Array.from({ length: 16 }, (_, i) => i + 353) }
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
        if (secao <= 16) return "8 e 9";
        if (secao <= 18) return "9 e 10";
        if (secao <= 20) return "10 e 11";
        if (secao <= 22) return "11 e 12";
        return "";
    };

    const handleArmarioClick = (numero, secao) => {
        setArmarioSelecionado(numero);
        setInfoModal({
            numero,
            secao,
            corredor: '2',
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
                    <LinhaSala numero={8} />
                    <SecaoArmario secao={secoesArmarios[1]} />
                    <SecaoArmario secao={secoesArmarios[2]} />
                    <SecaoArmario secao={secoesArmarios[3]} />
                    <LinhaSala numero={9} />
                    <SecaoArmario secao={secoesArmarios[4]} />
                    <SecaoArmario secao={secoesArmarios[5]} />
                    <LinhaSala numero={10} />
                    <SecaoArmario secao={secoesArmarios[6]} />
                    <SecaoArmario secao={secoesArmarios[7]} />
                    <LinhaSala numero={11} />
                    <SecaoArmario secao={secoesArmarios[8]} />
                    <SecaoArmario secao={secoesArmarios[9]} />
                    <LinhaSala numero={12} />
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
