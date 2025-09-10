import express from 'express';
import cors from 'cors'
import nodemailer from 'nodemailer';

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
  const { email, armario } = req.body

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
      subject: "Termo de uso do armário",
      html: `<h2 style="color: black; font-family: Arial, sans-serif;">Termos de uso</h2>
            <p style="color: black; font-family: Arial, sans-serif;">${armario}</p>
            <p style="color: black; font-family: Arial, sans-serif;">Lorem ipsum dolor sit amet. Est sunt dolorem nam voluptatibus ducimus ut maiores aspernatur et eius quia qui iste quia et nemo explicabo. Aut voluptatem iure a earum minus aut laboriosam distinctio a itaque consequatur est labore nemo et quam autem et excepturi quia. Ut quam dolores ad vero nesciunt est amet facilis aut quam fugiat! Ab cupiditate rerum qui corrupti dolorum est debitis nesciunt.</p>
            <p style="color: black; font-family: Arial, sans-serif;">Eum quos dolores ab officiis sint ut veniam quia et corrupti blanditiis. Vel iure quos ab quos voluptate aut voluptatem consectetur 33 laboriosam repudiandae et Quis quia et Quis quisquam. Nam deserunt dolorem vel repudiandae minima ex eligendi omnis et necessitatibus quia.</p>
            <p style="color: black; font-family: Arial, sans-serif;">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
            <p style="color: black; font-family: Arial, sans-serif;">Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>`
    });

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
