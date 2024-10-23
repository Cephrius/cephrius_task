import asyncHandler from "express-async-handler";
import TaskModel from "../../models/task/TaskModel.js";

export const createTask = asyncHandler(async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;

    // Validating the title and description fields
    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required!" });
    }
    if (!description || description.trim() === "") {
      return res.status(400).json({ message: "Description is required!" });
    }

    // Creating a new task with the correct fields
    const task = new TaskModel({
      title, // Using 'title' here instead of 'task'
      description,
      dueDate,
      priority,
      status,
      user: req.user._id,
    });

    // Saving the task to the database
    await task.save();

    // Returning the created task
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export const getTasks = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).json({ message: "User not found" });
    }

    const tasks = await TaskModel.find({ user: userId });
    res.status(200).json({
      length: tasks.length,
      tasks,
    });
  } catch (error) {
    console.log("Error in getting tasks:", error.message);
    res.status(500).json({ message: error.message });
  }
});

export const getTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Please provide task id" });
    }
    const task = await TaskModel.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if the task belongs to the correct userId
    if (!task.user.equals(userId)) {
      return res
        .status(401)
        .json({ message: "Not authorized to view this task! " }); // send a 401 (not authorized)
    }
    res.status(200).json(task);
  } catch (error) {
    console.log("Error in getting task:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// controller to update user tasks
export const updateTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const { id } = req.params;
    const { title, description, dueDate, priority, status, completed } =
      req.body;

    if (!id) {
      return res.status(400).json({
        message: "Please provide task id",
      });
    }

    const task = await TaskModel.findById(id);

    if (!task) {
      res.status(404).json({ message: "Task not found! " });
    }

    // Check if the user is the owner of this task
    if (!task.user.equals(userId)) {
      return res
        .status(401)
        .json({ message: "Not authorized to update this task!" });
    }
    // update the task with the new info provided if not keep the old info
    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    task.completed = completed || task.completed;

    await task.save(); // Save the new info or not

    res.status(200).json(task);
  } catch (error) {
    console.log("Error in updating task:", error.message);
    res.status(500).json({ message: error.message });
  }
});

export const deleteTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Please provide task id" });
    }

    await TaskModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Task deleted successfully!" });
  } catch (error) {
    console.log("Error in deleteTask: ", error.message);
    res.status(500).json({ message: error.message });
  }
});
