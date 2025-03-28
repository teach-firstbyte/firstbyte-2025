import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// This route handler will serve the GLB file from the public directory
export async function GET() {
  try {
    // Get the file path
    const filePath = path.join(process.cwd(), "public", "FirstByteBitex4.glb")

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      console.error("Model file not found at:", filePath)
      return new NextResponse("File not found", { status: 404 })
    }

    // Read the file
    const fileBuffer = fs.readFileSync(filePath)

    // Return the file with the correct content type
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "model/gltf-binary",
        "Content-Disposition": 'inline; filename="FirstByteBitex4.glb"',
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Error serving model:", error)
    return new NextResponse("Error serving model", { status: 500 })
  }
}

