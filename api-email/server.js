import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'
import axios from 'axios'

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
        user: 'osabentao@gmail.com', 
        pass: 'yeia ymes kggv xznh',  
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

app.listen(3000, () => {
  console.log('API rodando na porta 3000')
})
