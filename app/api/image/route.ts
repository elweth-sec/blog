import { NextResponse } from 'next/server';
import { imageToBase64 } from '@/lib/utils/image';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const imagePath = searchParams.get('path');
    
    if (!imagePath) {
      return NextResponse.json({ error: 'No image path provided' }, { status: 400 });
    }

    const base64Image = await imageToBase64(imagePath);
    
    if (!base64Image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    return NextResponse.json({ base64: base64Image });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}