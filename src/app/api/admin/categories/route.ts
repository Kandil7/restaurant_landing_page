import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ensureDefaultData } from '@/lib/seed';

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

    // Ensure default data exists
    await ensureDefaultData();

    const categories = await db.category.findMany({
      include: {
        items: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        order: 'asc'
      }
    });

    return NextResponse.json(categories);
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

    // Ensure default data exists
    await ensureDefaultData();

    const { name, description, image, order, visible } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Get the highest order if not specified
    let categoryOrder = order;
    if (categoryOrder === undefined) {
      const maxOrder = await db.category.findFirst({
        orderBy: { order: 'desc' },
        select: { order: true }
      });
      categoryOrder = maxOrder ? maxOrder.order + 1 : 0;
    }

    const category = await db.category.create({
      data: {
        name,
        description,
        image,
        order: categoryOrder,
        visible: visible !== undefined ? visible : true
      },
      include: {
        items: true
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}