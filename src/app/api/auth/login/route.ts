import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin } from '@/lib/firebase-service';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const result = await authenticateAdmin(email, password);

    if (result.authenticated) {
      // In a real app, you would generate a JWT token here
      // For this example, we'll just return the user data
      return NextResponse.json({
        user: {
          id: result.id,
          email: result.email,
          name: result.name
        },
        token: `admin-token-${Date.now()}` // Simple token for demo
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
