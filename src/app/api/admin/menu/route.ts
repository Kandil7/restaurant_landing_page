import { NextRequest, NextResponse } from 'next/server';
import { getCategories, addCategory, updateCategory, deleteCategory, getMenuItemsByCategoryId, addMenuItem, updateMenuItem, deleteMenuItem } from '@/lib/firebase-service';

// Middleware to check authentication
function authenticate(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.substring(7);
  return token.startsWith('admin-token-');
}

export async function GET(request: NextRequest) {
  try {
    if (!authenticate(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!authenticate(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, ...data } = body;

    if (type === 'category') {
      const newCategory = await addCategory(data);
      return NextResponse.json(newCategory);
    } else if (type === 'item') {
      const newItem = await addMenuItem(data);
      return NextResponse.json(newItem);
    } else {
      return NextResponse.json({ error: 'Invalid item type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!authenticate(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, type, ...updates } = body;

    if (type === 'category') {
      await updateCategory(id, updates);
      return NextResponse.json({ success: true });
    } else if (type === 'item') {
      await updateMenuItem(id, updates);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Invalid item type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!authenticate(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');

    if (!id || !type) {
      return NextResponse.json({ error: 'Missing id or type parameter' }, { status: 400 });
    }

    if (type === 'category') {
      await deleteCategory(id);
      return NextResponse.json({ success: true });
    } else if (type === 'item') {
      await deleteMenuItem(id);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Invalid item type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 });
  }
}
