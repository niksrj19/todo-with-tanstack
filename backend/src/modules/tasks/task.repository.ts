import { pool } from "../../config/database";

import {
  Task,
  CreateTaskInput,
  UpdateTaskInput
} from "./task.types";

import { TaskQueryDTO } from "./task.validation";

export const taskRepository = {

  async findAll(filters: TaskQueryDTO) {
    const conditions: string[] = [];
    const values: unknown[] = [];

    if (filters.status) {
      values.push(filters.status);
      conditions.push(`status = $${values.length}`);
    }

    if (filters.priority) {
      values.push(filters.priority);
      conditions.push(`priority = $${values.length}`);
    }

    if (filters.search) {
      values.push(`%${filters.search}%`);

      conditions.push(
        `title ILIKE $${values.length}`
      );
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM tasks ${whereClause}`,
      values
    );

    const total = Number(countResult.rows[0].count);

    const offset = (filters.page - 1) * filters.limit;

    const dataValues = [...values];

    dataValues.push(filters.limit);
    const limitPosition = dataValues.length;

    dataValues.push(offset);
    const offsetPosition = dataValues.length;

    const result = await pool.query<Task>(
      `
        SELECT *
        FROM tasks
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${limitPosition}
        OFFSET $${offsetPosition}
      `,
      dataValues
    );

    return {
      data: result.rows,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total,
        totalPages: Math.ceil(total / filters.limit)
      }
    };
  },

  async findById(id: number) {
    const result = await pool.query<Task>(
      "SELECT * FROM tasks WHERE id = $1",
      [id]
    );

    return result.rows[0] ?? null;
  },

  async create(input: CreateTaskInput) {
    const result = await pool.query<Task>(
      `
        INSERT INTO tasks (
          title,
          description,
          status,
          priority
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `,
      [
        input.title,
        input.description ?? null,
        input.status ?? "TODO",
        input.priority ?? "MEDIUM"
      ]
    );

    return result.rows[0];
  },

  async update(id: number, input: UpdateTaskInput) {
    const fields = Object.keys(input) as Array<
      keyof UpdateTaskInput
    >;

    const values = fields.map(field => input[field]);

    const setClause = fields
      .map((field, index) => {
        return `${field} = $${index + 1}`;
      })
      .join(", ");

    values.push(id);

    const result = await pool.query<Task>(
      `
        UPDATE tasks
        SET ${setClause}, updated_at = NOW()
        WHERE id = $${values.length}
        RETURNING *
      `,
      values
    );

    return result.rows[0] ?? null;
  },

  async delete(id: number) {
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING id",
      [id]
    );

    return result.rowCount !== null &&
      result.rowCount > 0;
  }
};