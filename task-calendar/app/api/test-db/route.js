import db from "@/utils/db"; // Import your MySQL connection

export async function GET() {
  try {
    // Run a test query
    const [rows] = await db.query("SHOW TABLES");

    return Response.json({ success: true, tables: rows });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
