import ThermalPrinter from "node-thermal-printer"
import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"

const app = express()
app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json())

app.post("/imprimir", async (req, res) => {
  try {
    const { carrinho, id_venda } = req.body
    console.log("Body recebido:", req.body)

    let printer = new ThermalPrinter.printer({
      type: "epson",
      interface: "/dev/usb/lp1", 
      characterSet: "SLOVENIA"
    })

    const isConnected = await printer.isPrinterConnected()
    console.log("Conectada?", isConnected)

    printer.alignCenter()
    printer.bold(true)
    printer.println("Obrigado por comprar pelo OSA!")
    printer.bold(false)

    const uniformes = (carrinho?.detalhesUniformesFormatados || "").trim()
    const armarios = (carrinho?.detalhesArmarioFormatado || "").trim()
    const extraUniformes = (carrinho?.extraUniformes || "").trim()

    if (uniformes && !armarios) {
      printer.println("\n--- UNIFORMES ---")
      printer.println(uniformes);
      printer.println("\n" + extraUniformes)
    } else if (armarios && !uniformes) {
      printer.println("\n--- ARMÁRIOS ---")
      printer.println(armarios);
    } else if (armarios && uniformes) {
      printer.println("\n--- UNIFORMES ---")
      printer.println(uniformes);
      printer.println("\n--- ARMÁRIOS ---")
      printer.println(armarios);
      printer.println("\n" + extraUniformes)
    }

    if (carrinho?.extra) {
      printer.println("\n" + carrinho.extra)
    }

    printer.println("\nNúmero da venda: " + id_venda)

    printer.newLine()
    printer.newLine()
    printer.newLine()

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)

    await printer.printImage(path.join(__dirname, "public", "osaCompleto.png"))

    printer.alignCenter()
    printer.bold(true)
    printer.println("VOTE NO OSA!\nPROJETO Nº58!")
    printer.bold(false)

    printer.cut()

    await printer.execute()

    res.send({ ok: true })
  } catch (err) {
    console.error("Erro ao imprimir:", err)
    res.status(500).send({ ok: false, error: err.message })
  }
})

app.listen(3001, () => console.log("Servidor rodando na porta 3001"))