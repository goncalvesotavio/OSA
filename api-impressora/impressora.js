import ThermalPrinter from "node-thermal-printer"
import express from "express"
import cors from "cors"

const app = express()
app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json())

app.post("/imprimir", async (req, res) => {
  const { carrinho, id_venda } = req.body

  console.log("Body recebido:", req.body)

  let printer = new ThermalPrinter.printer({
    type: "epson",
    interface: "console",
    characterSet: "SLOVENIA"
  });

  await printer.isPrinterConnected();

  printer.alignCenter();
  printer.bold(true);
  printer.println("Obrigado por comprar pelo OSA!");
  printer.bold(false);

  if (carrinho.detalhesUniformesFormatados.length > 0 && carrinho.detalhesArmarioFormatado.length == 0) {
    printer.println("\n--- UNIFORMES ---")
    printer.println(carrinho.detalhesUniformesFormatados)
    printer.println("\n" + carrinho.extraUniformes)
  } else if (carrinho.detalhesArmarioFormatado.length > 0 && carrinho.detalhesUniformesFormatados.length == 0) {
    printer.println("\n--- ARMÁRIOS ---")
    printer.println(carrinho.detalhesArmarioFormatado)
  } else if (carrinho.detalhesArmarioFormatado.length > 0 && carrinho.detalhesUniformesFormatados.length > 0){
    printer.println("\n--- UNIFORMES ---")
    printer.println(carrinho.detalhesUniformesFormatados)
    printer.println("\n--- ARMÁRIOS ---")
    printer.println(carrinho.detalhesArmarioFormatado)
    printer.println("\n" + carrinho.extraUniformes)
  }


  if (carrinho.extra) {
    printer.println("\n" + carrinho.extra);
  }

  printer.println("\nNúmero da venda: " + id_venda);

  await printer.execute();

  res.send({ ok: true });
});


app.listen(3001, () => console.log("Servidor rodando na porta 3001"))