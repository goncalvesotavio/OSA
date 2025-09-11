import { novaVendaUniforme, detalhesVendaUniforme, estoque, editarEstoque, detalhesVendaArmario } from './fetchCompras.jsx';
import { buscarDetalhesDoCarrinho } from './fetchUniformes.jsx';
import { mudarArmario } from './fetchArmarios.jsx'

export async function finalizarCompra(pagamento, cliente, carrinho, produtos, limparCarrinho) {
    
    const totalUniformes = carrinho.uniformes.reduce((acc, item) => {
        const produto = produtos.find(p => p.id_uniforme === item.id_uniforme)
        return acc + (produto ? produto.Preço * item.quantidade : 0)
    }, 0);

    const totalArmarios = carrinho.armarios.reduce((acc, item) => acc + (item.preco || 100), 0)
    const totalCompra = totalUniformes + totalArmarios

    if (totalCompra <= 0) {
        console.log("Carrinho vazio, nenhuma compra a ser finalizada.")
        return
    }

    const dataFormatada = new Date().toISOString().split('T')[0]

    let finalizada
    if (carrinho.uniformes.length > 0 || pagamento.formaPagamento === 'Dinheiro'){
        finalizada = false
    } else {
        finalizada = true
    }

    const infos = {
        data: dataFormatada,
        formaPagamento: pagamento.formaPagamento,
        pago: pagamento.pago,
        total: totalCompra,
        finalizada: finalizada
    }

    const id_venda = await novaVendaUniforme(cliente, infos)

    if (carrinho.uniformes.length > 0) {
        const detalhes = await buscarDetalhesDoCarrinho(carrinho.uniformes);
        for (let i = 0; i < carrinho.uniformes.length; i++) {
            const item = carrinho.uniformes[i];
            const detalheProduto = detalhes.find(d => d.id_estoque === item.id_estoque);
            if (!detalheProduto) continue;

            const qtd = item.quantidade;
            const precoUnitario = detalheProduto.Preço;
            const infosDetalhes = {
                id_venda: id_venda,
                id_uniforme: item.id_uniforme,
                qtd,
                id_estoque: item.id_estoque,
                precoUnitario,
                precoTotal: qtd * precoUnitario,
            };
            await detalhesVendaUniforme(infosDetalhes);

            const Estoque = await estoque(infosDetalhes);
            if (!Estoque || Estoque.Qtd_estoque == null) {
                console.warn('Stock não encontrado ou quantidade nula para o id:', infosDetalhes.id_estoque);
                continue;
            }
            const infosEstoque = {
                id_estoque: item.id_estoque,
                id_uniforme: item.id_uniforme,
                tamanho: Estoque.Tamanho,
                novaQtd: Estoque.Qtd_estoque - infosDetalhes.qtd
            };
            await editarEstoque(infosEstoque);
        }
    }
    
    if(carrinho.armarios.length > 0){
        for (let x = 0; x < carrinho.armarios.length; x++){
            const valorInt = parseInt(carrinho.armarios[x].numero)
            console.log("Valor recebido em mudarArmario:", valorInt)
            await mudarArmario(valorInt)
            detalhesVendaArmario(valorInt, id_venda)
        }
    }

    if (limparCarrinho) {
        limparCarrinho();
    }

    return id_venda
}
