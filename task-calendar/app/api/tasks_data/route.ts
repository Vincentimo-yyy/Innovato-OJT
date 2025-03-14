/* eslint-disable no-console */
import { NextResponse } from "next/server";

import db from "@/utils/db";

interface Task {
  id: string;
  title: string;
  priority: string;
  details: string;
  color: string;
}

// GET: Fetch all tasks
export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM tasks_data");

    return NextResponse.json(rows);
  } catch (error) {
    console.error("DB Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 },
    );
  }
}

// POST: Add a new task
export async function POST(req: Request) {
  try {
    const { id, title, priority, details, color } = await req.json();

    if (!title || !priority || !details || !color) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    await db.query(
      "INSERT INTO tasks_data (id, title, priority, details, color) VALUES (?, ?, ?, ?, ?)",
      [id, title, priority, details, color],
    );

    const newTask: Task = { id, title, priority, details, color };

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("DB Error:", error);

    return NextResponse.json({ error: "Failed to add task" }, { status: 500 });
  }
}

// DELETE: Remove a task by ID
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id)
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 },
      );

    await db.query("DELETE FROM tasks_data WHERE id = ?", [id]);

    return NextResponse.json({ message: "Task deleted" });
  } catch (error) {
    console.error("DB Error:", error);

    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 },
    );
  }
}

// PUT: Update a task by ID
export async function PUT(req: Request) {
  try {
    const { id, day, time_range } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Task ID are required" },
        { status: 400 },
      );
    }

    await db.query(
      "UPDATE tasks_data SET day = ?, time_range = ? WHERE id = ?",
      [day, time_range, id],
    );

    return NextResponse.json({ message: "Task schedule updated successfully" });
  } catch (error) {
    console.error("DB Error:", error);

    return NextResponse.json({ error: { error } }, { status: 500 });
  }
}
