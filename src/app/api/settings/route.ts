import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ensureDefaultData } from '@/lib/seed';

export async function GET() {
  try {
    // Ensure default data exists
    await ensureDefaultData();
    
    let settings = await db.restaurantSettings.findFirst();
    
    if (!settings) {
      settings = await db.restaurantSettings.create({
        data: {}
      });
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching restaurant settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}