import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Middleware to check authentication
function authenticate(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.substring(7);
  // Simple token validation (in production, use proper JWT validation)
  return token.startsWith('admin-token-');
}

export async function GET(request: NextRequest) {
  try {
    if (!authenticate(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const items = await db.menuItem.findMany({
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!authenticate(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, description, price, categoryId } = await request.json();

    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Name, price, and category are required' },
        { status: 400 }
      );
    }

    // Check if category exists
    const category = await db.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    const item = await db.menuItem.create({
      data: {
        name,
        description,
        price,
        categoryId
      },
      include: {
        category: true
      }
    });

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}