import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { CarrinhoContext } from '../context/CarrinhoContext'
import styles from '../styles/TermosUso.module.css'
import logoOsa from '/osaCompleto.png'
import { fetchContrato } from '../components/fetchContratos'
import { ClienteContext } from '../context/ClienteContext'
import { infosCliente } from '../components/fetchContratos'
import { salvarArquivo } from '../components/fetchContratos'
import { ArquivoContext } from '../context/ArquivoContext'

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
    const { adicionarArquivoContext } = useContext(ArquivoContext)

    const handleProceed = () => {
        navigate('/forma-pagamento')
    }

    const buscarCliente = async () => {
        const dadosCliente = await infosCliente(cliente)
        return dadosCliente
    }

    const handleDownloadDoc = async () => {
        try {
            const contrato = await fetchContrato(new Date().getFullYear())
            const caminhoContrato = contrato[0]?.Contrato
            const clienteArray = await buscarCliente()
            const cliente = clienteArray[0]
            if (!contrato) {
                alert("Contrato não encontrado!")
                return
            } else {
                console.log(contrato)
            }
            const response = await fetch("http://localhost:4000/gera-doc", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contrato: caminhoContrato, 
                    cliente: cliente
                })
            })
            if (!response.ok) throw new Error("Erro ao baixar documento")
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = "Contrato_uso_2025_${cliente.Nome}.pdf"
            document.body.appendChild(a)
            a.click()
            a.remove()
            window.URL.revokeObjectURL(url)
            const urlBD = await salvarArquivo(blob)
            adicionarArquivoContext(urlBD)
        } catch (error) {
            console.error(error)
            alert("Erro ao baixar documento")
        }
        
        navigate('/forma-pagamento')
    }


    return (
        <div className={styles.paginaTermos}>
            <button onClick={() => navigate(-1)} className={styles.botaoVoltar}>←</button>
            <header className={styles.cabecalho}>
                <IconeTermos />
                <h1>Termos de Uso</h1>
            </header>
            <main className={styles.containerTermos}>
                <div className={styles.textoTermos}>
                    <p>Lorem ipsum dolor sit amet. Est sunt dolorem nam voluptatibus ducimus ut maiores aspernatur et eius quia qui iste quia et nemo explicabo. Aut voluptatem iure a earum minus aut laboriosam distinctio a itaque consequatur est labore nemo et quam autem et excepturi quia. Ut quam dolores ad vero nesciunt est amet facilis aut quam fugiat! Ab cupiditate rerum qui corrupti dolorum est debitis nesciunt.</p>
                    <p>Eum quos dolores ab officiis sint ut veniam quia et corrupti blanditiis. Vel iure quos ab quos voluptate aut voluptatem consectetur 33 laboriosam repudiandae et Quis quia et Quis quisquam. Nam deserunt dolorem vel repudiandae minima ex eligendi omnis et necessitatibus quia.</p>
                    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
                    <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>
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
    );
}
