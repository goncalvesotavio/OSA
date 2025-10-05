import { Routes, Route, Navigate } from 'react-router-dom'
import { ClienteProvider } from '../context/ClienteContext'
import { ArquivoProvider } from '../context/ArquivoContext'
import Layout from './Layout'

import TelaDescanso from '../pages/TelaDescanso';
import PaginaInicial from '../pages/PaginaInicial';
import TelaInicialUniformes from '../pages/TelaInicialUniformes';
import DetalhesProdutos from '../pages/DetalhesProdutos';
import VisualizarCarrinho from '../pages/VisualizarCarrinho';
import InfosCliente from '../pages/InfosCliente';
import ConfirmacaoCompra from '../pages/ConfirmacaoCompra';
import TermosUso from '../pages/TermosUso';
import FormaPagamento from '../pages/FormaPagamento';
import PagamentoPix from '../pages/PagamentoPix';
import PagamentoCartao from '../pages/PagamentoCartao';
import CartaoDebito from '../pages/CartaoDebito';
import CartaoCredito from '../pages/CartaoCredito';
import PagamentoDinheiro from '../pages/PagamentoDinheiro';
import TelaInicialArmarios from '../pages/TelaInicialArmarios';
import CorredorUm from '../pages/CorredorUm';
import CorredorDois from '../pages/CorredorDois';
import CorredorTres from '../pages/CorredorTres';
import CorredorMecanica from '../pages/CorredorMecanica';
import ArmarioAdicionado from '../pages/ArmarioAdicionado';

function Routers() {
    return (
        <ClienteProvider>
            <ArquivoProvider>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/inicio" element={<PaginaInicial />} />
                    <Route path="/armarios" element={<TelaInicialArmarios />} />
                    <Route path="/armarios/corredor/1" element={<CorredorUm />} />
                    <Route path="/armarios/corredor/2" element={<CorredorDois />} />
                    <Route path="/armarios/corredor/3" element={<CorredorTres />} />
                    <Route path="/armarios/corredor/mecanica" element={<CorredorMecanica />} />
                    <Route path="/uniformes" element={<TelaInicialUniformes />} />
                    <Route path="/uniforme/:id_uniforme" element={<DetalhesProdutos />} />
                    <Route path="/armario-adicionado/:numero" element={<ArmarioAdicionado />} />
                </Route>

                <Route path="/" element={<TelaDescanso />} />
                <Route path="/descanso" element={<TelaDescanso />} />
                <Route path="/carrinho" element={<VisualizarCarrinho />} />
                <Route path="/informacoes" element={<InfosCliente />} />
                <Route path="/confirmacao-compra" element={<ConfirmacaoCompra />} />
                <Route path="/termos-de-uso" element={<TermosUso />} />
                <Route path="/forma-pagamento" element={<FormaPagamento />} />
                <Route path="/pagamento-pix" element={<PagamentoPix />} />
                <Route path="/pagamento-cartao" element={<PagamentoCartao />} />
                <Route path="/pagamento-cartao-debito" element={<CartaoDebito />} />
                <Route path="/pagamento-cartao-credito" element={<CartaoCredito />} />
                <Route path="/pagamento-dinheiro" element={<PagamentoDinheiro />} />

                <Route path="*" element={<Navigate to="/descanso" />} />
            </Routes>
            </ArquivoProvider>
        </ClienteProvider>
    )
}

export default Routers
