import express from "express"
import fs from "fs"
import PizZip from "pizzip"
import Docxtemplater from "docxtemplater"
import cors from 'cors'
import fetch from 'node-fetch'

const app = express()
app.use(cors())
app.use(express.json())

app.post("/gera-doc", async (req, res) => {
  try {
    const { contrato } = req.body
    const response = await fetch(contrato)
      if (!response.ok) {
      throw new Error("Falha ao baixar o arquivo do contrato");
    }
    const templateBuffer = Buffer.from(await response.arrayBuffer())
    const zip = new PizZip(templateBuffer)
    const doc = new Docxtemplater(zip)
    doc.setData({ nome: "Otávio", endereco: "Rua A, 123" });
    doc.render();
    const output = doc.getZip().generate({ type: "nodebuffer" });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader("Content-Disposition", "attachment; filename=saida.docx");
    return res.send(output);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Erro ao gerar documento");
  }
})

app.listen(4000, () => {
  console.log('API rodando na porta 4000')
})