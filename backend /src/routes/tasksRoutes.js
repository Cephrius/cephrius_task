import express from "express";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "../controllers/task/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// create task
router.post("/task/create", protect, createTask);

// get all task based on user
router.get("/task", protect, getTasks);

// get specific task using user and taskId
router.get("/task/:id", protect, getTask);

// update user task
router.patch("/task/:id", protect, updateTask);

// delete user task
router.delete("/task/:id", protect, deleteTask);
export default router;
