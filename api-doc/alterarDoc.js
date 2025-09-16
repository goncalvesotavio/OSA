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
    const { contrato, infos } = req.body

    const response = await fetch(contrato)
    if (!response.ok) throw new Error("Falha ao baixar o arquivo do contrato")
    const templateBuffer = Buffer.from(await response.arrayBuffer())
    const zip = new PizZip(templateBuffer)

    console.log("Body recebido:", req.body)
    console.log("Contrato recebido:", contrato)
    console.log("Infos recebido:", infos)

    const doc = new Docxtemplater(zip)
    doc.render({
      nome: infos.Nome,
      rm: infos.RM,
      curso: infos.Curso,
      serie: infos.Serie,
      data1: "X",
      data2: " ",
      integrado: infos.integrado,
      modular: infos.modular,
      mtec: infos.mtec,
      manha: infos.manha,
      tarde: infos.tarde,
      noite: infos.noite,
      armario: infos.numero,
      preco: infos.preco
    })

    const outputDocx = path.join(__dirname, "saida.docx")

    const outputPdfName = `${infos.Nome}.pdf`
    const outputPdf = path.join(__dirname, outputPdfName)

    fs.writeFileSync(outputDocx, doc.getZip().generate({ type: "nodebuffer" }))

    await new Promise((resolve, reject) => {
      const pathToSoffice = `"C:\\Program Files\\LibreOffice\\program\\soffice.exe"`
      exec(
        `${pathToSoffice} --headless --convert-to pdf --outdir "${__dirname}" "${outputDocx}"`,
        (err, stdout, stderr) => {
          if (err) return reject(err)
          const generatedPdf = path.join(__dirname, "saida.pdf")
          if (fs.existsSync(generatedPdf)) {
            fs.renameSync(generatedPdf, outputPdf)
          }
          resolve()
        }
      )
    })

    const pdfBuffer = fs.readFileSync(outputPdf)
    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", `attachment; filename=${outputPdfName}`)
    res.send(pdfBuffer)

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