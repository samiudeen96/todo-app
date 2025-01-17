const express = require("express");
const { default: mongoose } = require("mongoose");
const cors = require("cors");
const app = express();

// app.get("/", (req, res) => {
//   res.send("hello world");
// });

app.use(express.json());
app.use(cors());

// Connecting mongodb
mongoose
  .connect("mongodb://localhost:27017/todo-app")
  .then(() => {
    console.log("DB connected...");
  })
  .catch((err) => {
    console.log(err);
  });

// Creating schema
const todoSchema = new mongoose.Schema({
  //   title: String,
  title: {
    required: true,
    type: String,
  },
  description: String,
});

// Creating model
const todoModel = mongoose.model("Todo", todoSchema);

// let todos = [];

// create a new todo item
app.post("/todos", async (req, res) => {
  const { title, description } = req.body;
  //   const newTodo = {
  //     id: todos.length + 1,
  //     title,
  //     description,
  //   };
  //   todos.push(newTodo);
  //   console.log(todos);

  try {
    const newTodo = new todoModel({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Get all items
app.get("/todos", async (req, res) => {
  try {
    const getAllTodos = await todoModel.find();
    res.json(getAllTodos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Update a todo item
app.put("/todos/:id", async (req, res) => {
  // const todoUpdate = await todoModel.findByIdAndUpdate(id);
  // res.json(todoUpdate);
  const { title, description } = req.body;
  const id = req.params.id;

  try {
    const updatedTodo = await todoModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
      },
      // gives updated data in postman and console
      { new: true }
    );

    if (!updatedTodo) {
      return res
        .status(404) // 404 Not Found: Resource not found on the server.
        .json({ message: "This particular todo not found" });
    }
    res.json(updatedTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message }); // 500 Internal Server Error: Generic error on the server.
  }
});

// Delete a todo item
app.delete("/todos/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const deletedTodo = await todoModel.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo item not found" }); // 404 Not Found: Resource not found on the server.
    }

    res.status(200).json({ message: "Deleted successfully..." }); // 200 OK: Request succeeded. The response contains the requested data.
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message }); // 500 Internal Server Error: Generic error on the server.
  }
});

// Get a single todo item
app.get("/todos/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const todoItem = await todoModel.findById(id);
    if (!todoItem) {
      return res.status(404).json({ message: "Todo item not found" });
    }
    res.json(todoItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const port = 8000;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
