import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "https://petviebrasil.com",
  })
);
const prisma = new PrismaClient();
app.get("/", async (req, res) => {
  const getUsers = await prisma.user.findMany();
  const simplifiedData = getUsers.map((user) => {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      telefone: user.phonenumber,
    };
  });
  console.log("usuarios retornados: ", simplifiedData);
  res.json(simplifiedData);
});

app.post("/api/submit-form", express.json(), async (req, res) => {
  const formData = await prisma.user.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      phonenumber: req.body.phonenumber,
    },
  });

  res.json({ message: "Form data received sucessfully.", data: formData });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
