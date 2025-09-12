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
    const { contrato, cliente } = req.body
    const response = await fetch(contrato)
      if (!response.ok) {
      throw new Error("Falha ao baixar o arquivo do contrato");
    }
    const templateBuffer = Buffer.from(await response.arrayBuffer())
    const zip = new PizZip(templateBuffer)
    console.log("Cliente recebido:", cliente)
    console.log("Campos do cliente:", {
      nome: cliente?.Nome,
      rm: cliente?.RM,
      tipo: cliente?.Tipo_curso,
      curso: cliente?.Curso,
      serie: cliente?.Serie
  })
  const doc = new Docxtemplater(zip)
  doc.setData({ 
    nome: cliente?.Nome, 
    rm: cliente?.RM,
    curso: cliente?.Tipo_curso + " " + cliente?.Curso,
    serie: cliente?.Serie,
    data1: "X",
    data2: " "
  })
  doc.render()
    const output = doc.getZip().generate({ type: "nodebuffer" });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
    res.setHeader("Content-Disposition", "attachment; filename=Contrato_Aramario_2025.docs")
    return res.send(output)
  } catch (err) {
    console.error(err)
    return res.status(500).send("Erro ao gerar documento")
  }
})

app.listen(4000, () => {
  console.log('API rodando na porta 4000')
})