import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ensureDefaultData } from '@/lib/seed';

export async function GET(request: NextRequest) {
  try {
    // Ensure default data exists
    await ensureDefaultData();
    
    const categories = await db.category.findMany({
      where: {
        visible: true
      },
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