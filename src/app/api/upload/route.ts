import { NextRequest, NextResponse } from 'next/server';
import { uploadFile } from '@/lib/firebase-service';
import { getAuth } from 'firebase/auth';

// Middleware to check authentication
function authenticate(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.substring(7);
  return token.startsWith('admin-token-');
}

export async function POST(request: NextRequest) {
  try {
    if (!authenticate(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const path = formData.get('path') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!path) {
      return NextResponse.json({ error: 'No path provided' }, { status: 400 });
    }

    // Generate a unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}.${fileExtension}`;
    const fullPath = `${path}/${fileName}`;

    // Upload the file to Firebase Storage
    const downloadUrl = await uploadFile(file, fullPath);

    return NextResponse.json({
      success: true,
      downloadUrl,
      fileName,
      path: fullPath
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
