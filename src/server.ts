import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "wellitonaraujodev@gmail.com",
    pass: "rogl fcup lfsv qxer",
  },
  debug: true,
});

const validateForm = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Formato de email inválido." });
  }
  next();
};

app.post("/send-email", validateForm, (req: Request, res: Response) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: "wellitonaraujodev@gmail.com",
    subject: "Nova mensagem do formulário de contato",
    text: `Nome: ${name}\nEmail: ${email}\nMensagem: ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Erro ao enviar o email:", error);
      res.status(500).json({ error: "Erro ao enviar o email." });
    } else {
      console.log("Email enviado:", info.response);
      res.status(200).json({ message: "Email enviado com sucesso!" });
    }
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Rota não encontrada." });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Algo deu errado." });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
