const express = require("express");
const asyncHandler = require("express-async-handler");
const { errorHandler } = require("./middleware");
const {
  getCharacters,
  getCharacterById,
  deleteCharacterById,
  addOrUpdateCharacter,
} = require("./dynamo");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

app.get(
  "/characters",
  asyncHandler(async (req, res) => {
    try {
      const result = await getCharacters();
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  })
);

app.get(
  "/characters/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
      const result = await getCharacterById(id);
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  })
);

app.post(
  "/characters/create",
  asyncHandler(async (req, res) => {
    const character = req.body;
    if (!character) {
      throw new Error("Please add a character");
    }
    try {
      await addOrUpdateCharacter(character);
      return res.status(200).json({ message: "Created successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  })
);

app.post(
  "/characters/edit/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const character = req.body;
    character.id = id;

    if (!character) {
      throw new Error("Please add a character");
    }
    try {
      await addOrUpdateCharacter(character);
      return res.status(200).json({ message: "Updated successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  })
);

app.delete(
  "/characters/delete/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
      await deleteCharacterById(id);
      return res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  })
);

const port = process.env.PORT || 9005;

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Listening to port: ${port}`);
});
