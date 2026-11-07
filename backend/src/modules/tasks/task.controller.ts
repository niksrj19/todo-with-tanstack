import { Request, Response, NextFunction } from "express";

import { taskService } from "./task.service";

import {
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema
} from "./task.validation";

export const taskController = {

  async getTasks(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const filters = taskQuerySchema.parse(req.query);

      const result = await taskService.getTasks(filters);

      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  },

  async getTaskById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid task ID"
        });
      }

      const task = await taskService.getTaskById(id);

      res.status(200).json({
        success: true,
        data: task
      });
    } catch (error) {
      next(error);
    }
  },

  async createTask(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const input = createTaskSchema.parse(req.body);

      const task = await taskService.createTask(input);

      res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: task
      });
    } catch (error) {
      next(error);
    }
  },

  async updateTask(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid task ID"
        });
      }

      const input = updateTaskSchema.parse(req.body);

      const task = await taskService.updateTask(id, input);

      res.status(200).json({
        success: true,
        message: "Task updated successfully",
        data: task
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteTask(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid task ID"
        });
      }

      const result = await taskService.deleteTask(id);

      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }
};