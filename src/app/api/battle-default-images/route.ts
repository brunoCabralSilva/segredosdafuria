import { NextResponse } from "next/server";
import { readdir } from "node:fs/promises";
import path from "node:path";

const battleDefaultDirectoryPath = path.join(
  process.cwd(),
  "public",
  "images",
  "battle",
  "default"
);

const supportedExtensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

export async function GET() {
  try {
    const directoryEntries = await readdir(battleDefaultDirectoryPath, {
      withFileTypes: true,
    });

    const images = directoryEntries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((fileName) => supportedExtensions.has(path.extname(fileName).toLowerCase()))
      .sort((first, second) => first.localeCompare(second, "pt-BR"));

    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: [] }, { status: 500 });
  }
}