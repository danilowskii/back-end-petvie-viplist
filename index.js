import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const PORT = process.env.PORT || 3000;
const app = express();

// Parse JSON
app.use(express.json());

// Lista de origens permitidas
const allowedOrigins = [
  "https://petviebrasil.com",
  "https://www.petviebrasil.com",
];

// CORS options flexível
const corsOptions = {
  origin: (origin, callback) => {
    // permite requisições sem origin (curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware CORS global
app.use(cors(corsOptions));

// Garantir que OPTIONS retorne headers corretos
app.options("*", cors(corsOptions));

const prisma = new PrismaClient();

// Rota de teste GET
app.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    console.error("Erro ao buscar usuários:", err);
    res
      .status(500)
      .json({ message: "Erro ao buscar usuários", error: err.message });
  }
});

// POST endpoint para cadastro
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

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
