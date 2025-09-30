import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CarrinhoContext } from '../context/CarrinhoContext'
import styles from '../styles/TermosUso.module.css'
import logoOsa from '/osaCompleto.png'
import { fetchContrato } from '../components/fetchContratos'
import { ClienteContext } from '../context/ClienteContext'
import { infosCliente } from '../components/fetchContratos'
import { salvarArquivo } from '../components/fetchContratos'
import { ArquivoContext } from '../context/ArquivoContext'
import { procurarDatas } from '../components/fetchArmarios'

const IconeTermos = () => (
    <svg className={styles.iconeCabecalho} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);

export default function TermosUso() {
    const navigate = useNavigate()
    const { limparCarrinho } = useContext(CarrinhoContext)
    const [aceito, setAceito] = useState(false)
    const { cliente } = useContext(ClienteContext)
    const { adicionarArquivoContext, adicionarInfosContext, infos, adicionarArmariosContext, armarios } = useContext(ArquivoContext)
    const { carrinho, adicionarArmario } = useContext(CarrinhoContext)
    const [data, setData] = useState()

    const handleProceed = () => {
        navigate('/forma-pagamento')
    }

    const buscarCliente = async () => {
        const dadosCliente = await infosCliente(cliente)
        return dadosCliente
    }

    const handleDownloadDoc = async () => {
        try {
            
            const clienteArray = await buscarCliente()
            const cliente = clienteArray[0]
            adicionarInfosContext(cliente)
            
            for (let i = 0; i < carrinho.armarios.length; i++) {
            const contrato = await fetchContrato(new Date().getFullYear())
            const caminhoContrato = contrato[0]?.Contrato
            if (!contrato) {
                alert("Contrato não encontrado!")
                return
            }

            const response = await fetch("http://localhost:3000/gera-doc", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contrato: caminhoContrato, 
                    infos: { ...infos, ...cliente, ...carrinho.armarios[i] }
                })
            })

            if (!response.ok) throw new Error("Erro ao baixar documento")
            const blob = await response.blob()
            const nomeArquivo = `Contrato_uso_2025_${carrinho.armarios[i].numero}.pdf`

            const urlBD = await salvarArquivo(blob, nomeArquivo)

            adicionarArmariosContext({
                numero: carrinho.armarios[i].numero,
                preco: carrinho.armarios[i].preco,
                contratoUrl: urlBD,
                contratoNome: nomeArquivo
            })
        }

        } catch (error) {
            console.error(error)
            alert("Erro ao baixar documento")
        }
        
        navigate('/forma-pagamento')
    }

    useEffect(() => {
        const datas = procurarDatas(new Date().getFullYear())
    })

    return (
        <div className={styles.paginaTermos}>
            <button onClick={() => navigate(-1)} className={styles.botaoVoltar}>←</button>
            <header className={styles.cabecalho}>
                <IconeTermos />
                <h1>Termos de Uso</h1>
            </header>
            <main className={styles.containerTermos}>
                <div className={styles.textoTermos}>
                  <ul>
                    <li>O armário é da escola. A aquisição de armários na ETEC Bento Quirino é feita pela administração da Escola, sob total responsabilidade da mesma;</li>
                    <li>Os horários de venda dos armários serão divulgados no mural da Secretaria no pátio, no site da escola e no facebook;</li>
                    <li>Impreterivelmente, até o dia <strong>19 de dezembro (anual) ou 11 de julho (semestral)</strong>, todos os armários deverão ser desocupados, inclusive os livros devem ser retirados e entregues a coordenação do núcleo comum, para passarem por limpeza e manutenção e serem reorganizados para o ano seguinte. Assim, o aluno deve retirar todos os seus pertences ao fim do ano letivo. A escola não se responsabilizará por pertences deixados nos armários;</li>
                    <li><strong>Materiais que permanecerem nos armários após o prazo para retirada dos mesmos, serão doados;</strong></li>
                    <li>A escola se reserva o direito de abrir qualquer armário em caso de necessidade;</li>
                    <li>Por amostragem será feita a vistoria nos armários dos alunos, em qualquer dia e horário, sendo que o mesmo deverá abrir e acompanhar a vistoria de seu armário, diante de um membro da equipe diretiva ou coordenação, registrando-se na ficha individual as eventuais irregularidades que serão também levadas ao conhecimento de seus pais ou responsáveis;</li>
                    <li><strong>É PROIBIDO colar adesivos, escrever, desenhar ou fazer qualquer tipo de anotação na porta dos armários ou em qualquer parte da estrutura do mesmo. Se trata de um patrimônio público;</strong></li>
                    <li>É vedada a colocação de qualquer objeto na parte externa, em cima ou em baixo dos armários;</li>
                    <li>O cadeado para segurança das portas de cada armário é de total responsabilidade do aluno que contratou o serviço;</li>
                    <li>Não será de responsabilidade da administração da escola, o desaparecimento de objetos ou pertences dentro de armários sem cadeado;</li>
                    <li>Não é permitido armazenar ou guardar ALIMENTOS dentro dos armários ou qualquer objetivo que gere mal cheiro;</li>
                    <li>Os armários devem ser usados somente para guardar material didático;</li>
                    <li>Para não dificultar o andamento das aulas, os armários deverão ser utilizados somente no horário que o aluno não estiver em aula;</li>
                    <li>Questões referentes à manutenção ou problemas nos armários devem ser protocoladas na secretaria, que serão direcionadas para providencia;</li>
                    <li>O aluno deverá devolver o armário nas condições em que o recebeu, ou seja, em perfeito estado de conservação e limpeza, até o dia 20 de dezembro (anual) ou 05 de julho (semestral);</li>
                    <li>É vedada a troca de armários entre alunos;</li>
                    <li>É vedada a abertura e/ou manuseio do conteúdo de qualquer armário que não seja o atribuído pela administração da escola ao aluno;</li>
                    <li>Eventuais custos com reparo do armário, devido à utilização inadequada, serão cobrados do(s) usuário(s).
Em caso de pandemia, terremoto, catástrofes naturais ou algo do tipo que não sejam de responsabilidade da APM ou da Etec Bento Quirino, impossibilitando o uso do armário em um determinado período de tempo, não nos responsabilizamos pela devolução do dinheiro investido.</li>
                  </ul>
                  <p><strong>Lembre-se, hoje você esta usando o armário, amanhã outros utilizarão.</strong></p>  
                </div>
                <div className={styles.areaCheckbox}>
                    <input
                        type="checkbox"
                        id="aceite"
                        checked={aceito}
                        onChange={() => setAceito(!aceito)}
                    />
                    <label htmlFor="aceite">Li e concordo com os termos de uso.</label>
                </div>
                <button
                    className={styles.botaoProsseguir}
                    disabled={!aceito}
                    onClick={handleDownloadDoc}
                >
                    Prosseguir
                </button>
            </main>
            <img src={logoOsa} alt="Logo OSA" className={styles.logoCanto} />
        </div>
    )
}