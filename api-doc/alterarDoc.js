import express from "express"
import fs from "fs"
import PizZip from "pizzip"
import Docxtemplater from "docxtemplater"
import cors from "cors"
import fetch from "node-fetch"
import { exec } from "child_process"
import path from "path"
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
app.use(cors())
app.use(express.json())

app.post("/gera-doc", async (req, res) => {
  try {
    const { contrato, cliente } = req.body

    // Busca o template do contrato
    const response = await fetch(contrato)
    if (!response.ok) throw new Error("Falha ao baixar o arquivo do contrato")
    const templateBuffer = Buffer.from(await response.arrayBuffer())
    const zip = new PizZip(templateBuffer)

    // Preenche os dados
    const doc = new Docxtemplater(zip)
    doc.render({
      nome: cliente?.Nome,
      rm: cliente?.RM,
      curso: cliente?.Tipo_curso + " " + cliente?.Curso,
      serie: cliente?.Serie,
      data1: "X",
      data2: " ",
    })

    // Define caminhos
    const outputDocx = path.join(__dirname, "saida.docx")

    // Cria nome seguro para o PDF
    const safeNome = cliente.Nome.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "")
    const outputPdfName = `Contrato_uso_2025_${safeNome}.pdf`
    const outputPdf = path.join(__dirname, outputPdfName)

    // Salva o docx temporário
    fs.writeFileSync(outputDocx, doc.getZip().generate({ type: "nodebuffer" }))

    // Converte para PDF com LibreOffice
    await new Promise((resolve, reject) => {
      const pathToSoffice = `"C:\\Program Files\\LibreOffice\\program\\soffice.exe"`
      exec(
        `${pathToSoffice} --headless --convert-to pdf --outdir "${__dirname}" "${outputDocx}"`,
        (err, stdout, stderr) => {
          if (err) return reject(err)
          // LibreOffice sempre gera o PDF com o mesmo nome do DOCX, então renomeamos
          const generatedPdf = path.join(__dirname, "saida.pdf") // nome padrão gerado
          if (fs.existsSync(generatedPdf)) {
            fs.renameSync(generatedPdf, outputPdf)
          }
          resolve()
        }
      )
    })

    // Envia o PDF
    const pdfBuffer = fs.readFileSync(outputPdf)
    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", `attachment; filename=${outputPdfName}`)
    res.send(pdfBuffer)

    // Limpa arquivos temporários
    fs.unlinkSync(outputDocx)
    fs.unlinkSync(outputPdf)

  } catch (err) {
    console.error(err)
    res.status(500).send("Erro ao gerar documento")
  }
})

app.listen(4000, () => {
  console.log("API rodando na porta 4000")
})