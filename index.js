import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

const corsOptions = {
  origin: "https://petviebrasil.com",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Aplica CORS para todas as rotas
app.use(cors(corsOptions));

// Garantir que todas requisições OPTIONS recebam os headers corretos
app.options("*", cors(corsOptions));

const prisma = new PrismaClient();

// GET de teste
app.get("/", async (req, res) => {
  const getUsers = await prisma.user.findMany();
  const simplifiedData = getUsers.map((user) => ({
    id: user.id,
    email: user.email,
    name: user.name,
    telefone: user.phonenumber,
  }));
  console.log("usuarios retornados: ", simplifiedData);
  res.json(simplifiedData);
});

// POST /api/submit-form
app.post("/api/submit-form", async (req, res) => {
  try {
    console.log("Novo cadastro recebido:", req.body);

    const formData = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        phonenumber: req.body.phonenumber,
      },
    });

    console.log("Cadastro salvo no DB:", formData);
    res.json({ message: "Form data received successfully.", data: formData });
  } catch (err) {
    console.error("Erro ao cadastrar usuário:", err);
    res
      .status(500)
      .json({ message: "Erro ao cadastrar usuário.", error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
