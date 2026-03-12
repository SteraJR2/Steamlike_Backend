const express = require("express");
const path = require("path");
const cors = require("cors");

const Games = require("./Games");
const app = express();
const joi = require("joi");

function validateGame(game) {
  const schema = joi.object({
    id: joi.number(),
    nome: joi.string().min(1).max(50).required().lowercase().trim(),
    prezzo: joi.number().min(0).required(),
    tags: joi.array().items(joi.string().min(1).max(30)).required(),
    piattaforma: joi
      .string()
      .valid("PC", "PS4", "PS5", "Xbox One", "Xbox Series X", "Switch")
      .required()
      .trim(),
    dataUscita: joi
      .date()
      .default(() => new Date())
      .required(),
    sviluppatore: joi.string().min(1).max(50).required(),
  });
  return schema.validate(game);
}

function validateGameUpdate(game) {
  const schema = joi.object({
    id: joi.number(),
    nome: joi.string().min(1).max(50).lowercase().trim(),
    prezzo: joi.number().min(0),
    tags: joi.array().items(joi.string().min(1).max(30)),
    piattaforma: joi
      .string()
      .valid("PC", "PS4", "PS5", "Xbox One", "Xbox Series X", "Switch")
      .trim(),
    dataUscita: joi.date().default(() => new Date()),
    sviluppatore: joi.string().min(1).max(50),
  });
  return schema.validate(game);
}

app.use(express.json());
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cors({
    origin: "*",
    methods: "PUT, GET, POST, DELETE, OPTIONS, PATCH",
    allowedHeaders:
      "Content-Type, Authorization, socket, Accept, X-Requested-With, Range, ConnectionName",
  }),
);

app.get("/test", (req, res) => {
  res.send("Prova ok.");
});

app.get("/", (req, res) => {
  res.send("Welcome.");
});

app.get("/games", async (req, res) => {
  const result = await Games.getGames();
  if (result.length === 0) {
    return res.send("No games available.");
  }
  res.send(result);
});

app.get("/games/:id", async (req, res) => {
  try {
    const result = await Games.getGame(req.params.id);
    if (!result) {
      return res.status(404).send("Game not found.");
    }
    res.send(result);
  } catch (error) {
    console.error(error);
  }
});

app.post("/games", async (req, res) => {
  try {
    const { error, value } = validateGame(req.body);
    if (error) {
      throw new Error(error.details[0].message);
    }
    await Games.saveGames(value);
    res.send("Game added successfully.");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.put("/games/:id", async (req, res) => {
  try {
    const gameToUpdate = {
      id: parseInt(req.params.id),
      ...req.body,
    };
    const { error, value } = validateGame(gameToUpdate);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    await Games.updateGames(value);
    res.send("Game updated.");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.delete("/games/:id", async (req, res) => {
  try {
    const gameToDelete = { id: parseInt(req.params.id) };
    await Games.deleteGames(gameToDelete);
    res.send("Game deleted.");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running.\nPort: ${PORT}`);
});
