import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const PORT = process.env.PORT || 3000;
const app = express();

// Parse JSON
app.use(express.json());

// CORS options
const corsOptions = {
  origin: "https://petviebrasil.com",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware CORS global
app.use(cors(corsOptions));

// Garantir que OPTIONS retorne headers corretos
app.options("*", cors(corsOptions));

const prisma = new PrismaClient();

// POST endpoint
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
