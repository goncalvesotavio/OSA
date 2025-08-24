import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/InfosCliente.module.css';
import { fetchClientes, adicionarCliente, atualizarCliente } from '../components/fetchClientes';
import { ClienteContext } from '../context/ClienteContext';
import { CarrinhoContext } from '../context/CarrinhoContext';
import { AlertContext } from '../context/AlertContext';
import TecladoVirtual from '../components/TecladoVirtual';
import logoOsa from '/osaCompleto.png';

export default function InfosCliente() {
    const navigate = useNavigate();
    const [nome, setNome] = useState('');
    const [rm, setRm] = useState('');
    const [email, setEmail] = useState('');
    const [tipoUsuario, setTipoUsuario] = useState('');
    const [tipoCurso, setTipoCurso] = useState('');
    const [curso, setCurso] = useState('');
    const [serie, setSerie] = useState('');
    const [modulo, setModulo] = useState('');
    
    const { adicionarClienteContext } = useContext(ClienteContext);
    const { carrinho } = useContext(CarrinhoContext);
    const { showAlert } = useContext(AlertContext);

    const [inputAtivo, setInputAtivo] = useState(null);
    const nomeInputRef = useRef(null);
    const rmInputRef = useRef(null);
    const emailInputRef = useRef(null);
    const tipoCursoSelectRef = useRef(null);
    const cursoSelectRef = useRef(null);
    const serieSelectRef = useRef(null);
    const moduloSelectRef = useRef(null);

    const cursosMtec = ["Administração - PI", "Administração - Noturno", "Logística - PI", "Desenvolvimento de Sistemas - MTEC", "Desenvolvimento de Sistemas - MTEC/AMS", "Desenvolvimento de Sistemas - Noturno", "Eletrônica - PI", "Eletrotécnica - MTEC", "Mecânica - PI"];
    const cursosModular = ["Contabilidade", "Eletrônica", "Eletrotécnica", "Mecânica"];

    const handleFocus = (inputName) => {
        setInputAtivo(inputName);
    };

    useEffect(() => {
        setTimeout(() => {
            let targetRef;
            if (inputAtivo === 'nome') {
                targetRef = nomeInputRef;
            } else if (inputAtivo === 'rm') {
                targetRef = rmInputRef;
            } else if (inputAtivo === 'email') {
                targetRef = emailInputRef;
            }

            if (targetRef && targetRef.current) {
                targetRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        }, 300);
    }, [inputAtivo]);

    const handleSelectClick = (ref) => {
        setInputAtivo(null);
        setTimeout(() => {
            ref.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }, 100);
    };

    const handleTecladoChange = (valor) => {
        if (inputAtivo === 'nome') {
            setNome(valor);
        } else if (inputAtivo === 'rm') {
            setRm(valor);
        } else if (inputAtivo === 'email') {
            setEmail(valor);
        }
    };

    const handleCancel = () => {
        navigate('/carrinho');
    };

    const handleOk = async () => {
        if (!nome || !email || !tipoUsuario) {
            showAlert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        const isAlunoOuResponsavel = tipoUsuario === 'Aluno' || tipoUsuario === 'Responsável';

        if (isAlunoOuResponsavel && carrinho.armarios.length > 0) {
            if (!rm) {
                showAlert('Por favor, preencha o campo RM.');
                return;
            }
            if (!tipoCurso || !curso) {
                showAlert('Por favor, selecione o tipo e o seu curso.');
                return;
            }
            if (tipoCurso === 'Integrado ao Ensino Médio - MTEC' && !serie) {
                showAlert('Por favor, selecione a sua série.');
                return;
            }
            if (tipoCurso === 'Modular' && !modulo) {
                showAlert('Por favor, selecione o seu módulo.');
                return;
            }
        }

        if (!isValidEmail(email)) {
            showAlert("Por favor, insira um email válido.");
            return;
        }
            
        await adicionarClienteNovo()
    }

    const adicionarClienteNovo = async () => {
        const todosCliente = await fetchClientes();
        const clienteExiste = todosCliente.find(cliente =>
            cliente.Nome.toLowerCase() === nome.toLowerCase() &&
            cliente.Email.toLowerCase() === email.toLowerCase() &&
            cliente.Categoria === tipoUsuario
        )

        const isAlunoOuResponsavel = tipoUsuario === 'Aluno' || tipoUsuario === 'Responsável'
            if (isAlunoOuResponsavel && carrinho.armarios.length > 0) {
                const clienteExisteRM = todosCliente.find(cliente =>
                    cliente.RM === rm
                )

                if (!clienteExisteRM && clienteExiste) {
                    const clienteUpdate = {
                        rm: rm,
                        tipoCurso: tipoCurso,
                        curso: curso
                    }

                    if (tipoCurso === 'Integrado ao Ensino Médio - MTEC') {
                        clienteUpdate.serie = serie;
                    }
                    if (tipoCurso === 'Modular') {
                        clienteUpdate.serie = modulo;
                    }

                    atualizarCliente(clienteExiste.id_cliente, clienteUpdate)
                }
            }

        if (!clienteExiste) {
            const clienteNovo = {
                nome: nome,
                email: email,
                categoria: tipoUsuario,
                rm,
                tipoCurso,
                curso,
                serie
            }

            const isAlunoOuResponsavel = tipoUsuario === 'Aluno' || tipoUsuario === 'Responsável'
            if (isAlunoOuResponsavel && carrinho.armarios.length > 0) {
                clienteNovo.categoria = "Aluno"
                clienteNovo.rm = rm
                clienteNovo.tipoCurso = tipoCurso
                clienteNovo.curso = curso
                if (tipoCurso === 'Integrado ao Ensino Médio - MTEC') {
                    clienteNovo.serie = serie;
                }
                if (tipoCurso === 'Modular') {
                    clienteNovo.serie = modulo;
                }
            }

            const clienteNovoId = await adicionarCliente(clienteNovo);
            adicionarClienteContext(clienteNovoId);
        } else {
            adicionarClienteContext(clienteExiste.id_cliente);
        }
        navigate('/confirmacao-compra');
    };

    const isValidEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    return (
        <div className={`${styles.paginaPagamento} ${inputAtivo ? styles.keyboardActive : ''}`}>
            <button onClick={() => navigate(-1)} className={styles.botaoVoltar}>←</button>

            <header className={styles.cabecalho}>
                <h1>Precisamos de algumas informações antes de finalizarmos sua compra.</h1>
            </header>

            <main className={styles.formContainer}>
                <div className={styles.campoForm}>
                    <label htmlFor="tipoUsuario">Você é:</label>
                    <select
                        id="tipoUsuario"
                        value={tipoUsuario}
                        onChange={(e) => setTipoUsuario(e.target.value)}
                        onFocus={() => setInputAtivo(null)}
                    >
                        <option value="" disabled>Selecione uma opção</option>
                        <option value="Aluno">Aluno</option>
                        <option value="Responsável">Responsável</option>
                        <option value="Professor">Professor</option>
                        <option value="Funcionário">Funcionário</option>
                    </select>
                </div>

                <div className={styles.campoForm}>
                    <label htmlFor="nome">{tipoUsuario === 'Responsável' ? 'Nome completo do aluno:' : 'Nome completo:'}</label>
                    <input
                        ref={nomeInputRef}
                        type="text"
                        id="nome"
                        value={nome}
                        onFocus={() => handleFocus('nome')}
                        readOnly
                        placeholder="Clique para digitar"
                        className={inputAtivo === 'nome' ? styles.inputAtivo : ''}
                    />
                </div>
                
                <div className={styles.campoForm}>
                    <label htmlFor="email">E-mail:</label>
                    <input
                        ref={emailInputRef}
                        type="email"
                        id="email"
                        value={email}
                        onFocus={() => handleFocus('email')}
                        readOnly
                        placeholder="Clique para digitar"
                        className={inputAtivo === 'email' ? styles.inputAtivo : ''}
                    />
                </div>

                {(tipoUsuario === 'Aluno' || tipoUsuario === 'Responsável') && carrinho.armarios.length > 0 && (
                    <>
                        <div className={styles.campoForm}>
                            <label htmlFor="rm">{tipoUsuario === 'Responsável' ? 'RM do aluno:' : 'RM:'}</label>
                            <input
                                ref={rmInputRef}
                                type="text"
                                id="rm"
                                value={rm}
                                onFocus={() => handleFocus('rm')}
                                readOnly
                                placeholder="Clique para digitar"
                                className={inputAtivo === 'rm' ? styles.inputAtivo : ''}
                            />
                        </div>

                        <div className={styles.campoForm}>
                            <label htmlFor="tipoCurso">{tipoUsuario === 'Responsável' ? 'Qual o tipo do curso do aluno?' : 'Qual o tipo do seu curso?'}</label>
                            <select
                                ref={tipoCursoSelectRef}
                                id="tipoCurso"
                                value={tipoCurso}
                                onClick={() => handleSelectClick(tipoCursoSelectRef)}
                                onChange={(e) => {
                                    setTipoCurso(e.target.value);
                                    setCurso('');
                                    setSerie('');
                                    setModulo('');
                                }}
                                onFocus={() => setInputAtivo(null)}
                            >
                                <option value="" disabled>Selecione o tipo</option>
                                <option value="Integrado ao Ensino Médio - MTEC">Integrado ao Ensino Médio - MTEC</option>
                                <option value="Modular">Modular</option>
                            </select>
                        </div>

                        {tipoCurso === 'Integrado ao Ensino Médio - MTEC' && (
                            <>
                                <div className={styles.campoForm}>
                                    <label htmlFor="curso">{tipoUsuario === 'Responsável' ? 'Qual o curso do aluno?' : 'Qual seu curso?'}</label>
                                    <select
                                        ref={cursoSelectRef}
                                        id="curso"
                                        value={curso}
                                        onClick={() => handleSelectClick(cursoSelectRef)}
                                        onChange={(e) => setCurso(e.target.value)}
                                        onFocus={() => setInputAtivo(null)}
                                    >
                                        <option value="" disabled>Selecione o curso</option>
                                        {cursosMtec.map(c => (<option key={c} value={c}>{c}</option>))}
                                    </select>
                                </div>
                                {curso && (
                                    <div className={styles.campoForm}>
                                        <label htmlFor="serie">{tipoUsuario === 'Responsável' ? 'Qual a série do aluno?' : 'Qual sua série?'}</label>
                                        <select
                                            ref={serieSelectRef}
                                            id="serie"
                                            value={serie}
                                            onClick={() => handleSelectClick(serieSelectRef)}
                                            onChange={(e) => setSerie(e.target.value)}
                                            onFocus={() => setInputAtivo(null)}
                                        >
                                            <option value="" disabled>Selecione a série</option>
                                            <option value="1">1ª Série</option>
                                            <option value="2">2ª Série</option>
                                            <option value="3">3ª Série</option>
                                        </select>
                                    </div>
                                )}
                            </>
                        )}

                        {tipoCurso === 'Modular' && (
                            <>
                                <div className={styles.campoForm}>
                                    <label htmlFor="curso">{tipoUsuario === 'Responsável' ? 'Qual o curso do aluno?' : 'Qual seu curso?'}</label>
                                    <select
                                        ref={cursoSelectRef}
                                        id="curso"
                                        value={curso}
                                        onClick={() => handleSelectClick(cursoSelectRef)}
                                        onChange={(e) => {
                                            setCurso(e.target.value);
                                            setModulo('');
                                        }}
                                        onFocus={() => setInputAtivo(null)}
                                    >
                                        <option value="" disabled>Selecione o curso</option>
                                        {cursosModular.map(c => (<option key={c} value={c}>{c}</option>))}
                                    </select>
                                </div>
                                {curso && (
                                    <div className={styles.campoForm}>
                                        <label htmlFor="modulo">{tipoUsuario === 'Responsável' ? 'Qual o módulo do aluno?' : 'Qual seu módulo?'}</label>
                                        <select
                                            ref={moduloSelectRef}
                                            id="modulo"
                                            value={modulo}
                                            onClick={() => handleSelectClick(moduloSelectRef)}
                                            onChange={(e) => setModulo(e.target.value)}
                                            onFocus={() => setInputAtivo(null)}
                                        >
                                            <option value="" disabled>Selecione o módulo</option>
                                            <option value="1">MÓDULO 1</option>
                                            <option value="2">MÓDULO 2</option>
                                            {curso !== 'Contabilidade' && (
                                                <option value="3">MÓDULO 3</option>
                                            )}
                                        </select>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}

                <div className={styles.botoesAcao}>
                    <button className={styles.botaoCancelar} onClick={handleCancel}>Cancelar</button>
                    <button className={styles.botaoOk} onClick={handleOk}>Ok</button>
                </div>
            </main>

            {inputAtivo && (
                <TecladoVirtual
                    value={inputAtivo === 'nome' ? nome : (inputAtivo === 'rm' ? rm : email)}
                    onChange={handleTecladoChange}
                    onClose={() => setInputAtivo(null)}
                />
            )}
            
            <img src={logoOsa} alt="Logo OSA" className={styles.logoCanto} />
        </div>
    );
}
