import { NextRequest, NextResponse } from 'next/server';
import { getRestaurantSettings, updateRestaurantSettings } from '@/lib/firebase-service';

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

export async function PUT(request: NextRequest) {
  try {
    if (!authenticate(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure default data exists
    await ensureDefaultData();

    const body = await request.json();
    const {
      restaurantName,
      logoUrl,
      primaryColor,
      secondaryColor,
      backgroundColor,
      contactPhone,
      contactEmail,
      address,
      workingHours,
      welcomeText
    } = body;

    let settings = await db.restaurantSettings.findFirst();

    if (settings) {
      settings = await db.restaurantSettings.update({
        where: { id: settings.id },
        data: {
          restaurantName,
          logoUrl,
          primaryColor,
          secondaryColor,
          backgroundColor,
          contactPhone,
          contactEmail,
          address,
          workingHours,
          welcomeText
        }
      });
    } else {
      settings = await db.restaurantSettings.create({
        data: {
          restaurantName,
          logoUrl,
          primaryColor,
          secondaryColor,
          backgroundColor,
          contactPhone,
          contactEmail,
          address,
          workingHours,
          welcomeText
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating restaurant settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}