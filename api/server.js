import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'
import axios from 'axios'
import fs from "fs"
import PizZip from "pizzip"
import Docxtemplater from "docxtemplater"
import fetch from "node-fetch"
import { exec } from "child_process"
import path from "path"
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const app = express();
app.use(cors())
app.use(express.json());

app.post('/enviar-email', async (req, res) => {
  const { email, carrinho, assunto, id_venda } = req.body

  const detalhesFormatados = `
${carrinho.uniformes || ''}
${carrinho.armarios || ''}
${carrinho.total || ''}
${carrinho.extra || ''}
`

  console.log('Body da requisição:', req.body)

  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'su.grotti@gmail.com', 
        pass: 'vdzp cisd zpva xxuy',  
      }
    });

    let info = await transporter.sendMail({
      from: "OSA osabentao@gmail.com",
      to: email,
      subject: assunto,
      html: `<h2 style="color: black; font-family: Arial, sans-serif;">Obrigado por comprar pelo OSA!</h2>
            <p style="color: black; font-family: Arial, sans-serif;">Detalhes da sua compra:</p>
            <pre style="color: black; font-family: Arial, sans-serif;">${detalhesFormatados}\n</pre>
            <pre style="color: black; font-family: Arial, sans-serif;">Número da venda: ${id_venda}</pre>`
    });

    console.log('Email enviado:', info.response);
    res.status(200).send({ sucesso: true, mensagem: 'Email enviado com sucesso!' });

  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).send({ sucesso: false, mensagem: 'Erro ao enviar email' });
  }
});

app.post('/enviar-email-termo-de-uso', async (req, res) => {
  const { email, armarios } = req.body

  console.log('Body da requisição:', req.body)

  try {
    const armariosArray = Array.isArray(armarios) ? armarios : [armarios]
    const armariosUnicos = armariosArray.filter(
      (armario, index, self) =>
        index === self.findIndex(a => a.contratoUrl === armario.contratoUrl)
    )

    const attachments = await Promise.all(
      armariosUnicos.map(async (armario) => {
        const resp = await axios.get(armario.contratoUrl, { responseType: "arraybuffer" })
        return {
          filename: armario.contratoNome || "termo.pdf",
          content: Buffer.from(resp.data, "binary"),
          contentType: "application/pdf",
        }
      })
    )

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'osabentao@gmail.com', 
        pass: 'yeia ymes kggv xznh',  
      }
    })

    let info = await transporter.sendMail({
      from: "OSA osabentao@gmail.com",
      to: email,
      subject: "Termo de uso do armário",
      attachments
    })

    console.log('Email enviado:', info.response);
    res.status(200).send({ sucesso: true, mensagem: 'Email enviado com sucesso!' });

  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).send({ sucesso: false, mensagem: 'Erro ao enviar email' });
  }
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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

    const armarioNum = infos.numero

    const doc = new Docxtemplater(zip)
    doc.render({
      nome: infos.Nome,
      rm: infos.RM,
      curso: infos.Curso,
      serie: infos.Serie,
      anual: infos[`anual_${armarioNum}`],
    semestral: infos[`semestral_${armarioNum}`],
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
      const pathToSoffice = `"C:\\Program Files\\LibreOffice\\program\\soffice.exe"` //windows
      //const pathToSoffice = `"/usr/bin/soffice"` //linux
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

app.listen(3000, () => {
  console.log('API rodando na porta 3000')
})
