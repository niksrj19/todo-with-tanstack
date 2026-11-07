import { taskRepository } from "./task.repository";

import {
  CreateTaskInput,
  UpdateTaskInput
} from "./task.types";

import { TaskQueryDTO } from "./task.validation";

export const taskService = {

  async getTasks(filters: TaskQueryDTO) {
    return taskRepository.findAll(filters);
  },

  async getTaskById(id: number) {
    const task = await taskRepository.findById(id);

    if (!task) {
      throw new Error("Task not found");
    }

    return task;
  },

  async createTask(input: CreateTaskInput) {
    return taskRepository.create(input);
  },

  async updateTask(
    id: number,
    input: UpdateTaskInput
  ) {
    const existingTask = await taskRepository.findById(id);

    if (!existingTask) {
      throw new Error("Task not found");
    }

    return taskRepository.update(id, input);
  },

  async deleteTask(id: number) {
    const existingTask = await taskRepository.findById(id);

    if (!existingTask) {
      throw new Error("Task not found");
    }

    await taskRepository.delete(id);

    return {
      message: "Task deleted successfully"
    };
  }
};