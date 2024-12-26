import fs from 'fs/promises';
import path from 'path';

export async function imageToBase64(imagePath: string): Promise<string | null> {
  try {
    const fullPath = path.join(process.cwd(), 'content', imagePath);
    const imageBuffer = await fs.readFile(fullPath);
    const base64Image = imageBuffer.toString('base64');
    const extension = path.extname(imagePath).slice(1).toLowerCase();
    const mimeType = `image/${extension === 'jpg' ? 'jpeg' : extension}`;
    return `data:${mimeType};base64,${base64Image}`;
  } catch (error) {
    console.error(`Error converting image to base64: ${imagePath}`, error);
    return null;
  }
}