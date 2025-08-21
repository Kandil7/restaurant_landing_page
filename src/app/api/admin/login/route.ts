import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ensureDefaultData } from '@/lib/seed';

export async function POST(request: NextRequest) {
  try {
    // Ensure default data exists
    await ensureDefaultData();
    
    const { email, password } = await request.json();

    // Simple authentication - in production, use proper auth system
    if (email === 'admin@restaurant.com' && password === 'admin123') {
      // Create a simple token (in production, use JWT)
      const token = 'admin-token-' + Date.now();
      
      return NextResponse.json({ 
        message: 'Login successful',
        token 
      });
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}