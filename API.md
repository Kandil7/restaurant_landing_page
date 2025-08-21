# API Documentation

## Overview

The restaurant menu system provides a comprehensive REST API for managing restaurant data, settings, and menu items. All APIs are built with Next.js API Routes and use JSON for data exchange.

## Base URL

```
https://your-domain.com/api
```

## Authentication

Most admin endpoints require authentication using Bearer tokens. The token is obtained through the login endpoint.

### Authentication Header
```
Authorization: Bearer <token>
```

## Public Endpoints

### GET /api/settings

Get restaurant settings including branding, colors, and contact information.

**Response:**
```json
{
  "id": "string",
  "restaurantName": "مطعمنا المميز",
  "logoUrl": "/restaurant-logo.png",
  "primaryColor": "#f59e0b",
  "secondaryColor": "#ea580c",
  "backgroundColor": "#fffbeb",
  "contactPhone": "1234-567-890",
  "contactEmail": "info@restaurant.com",
  "address": "شارع الملك فهد، الرياض",
  "workingHours": "من الساعة 11:00 صباحاً حتى 11:00 مساءً",
  "welcomeText": "مرحباً بك في مطعمنا!",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### GET /api/menu

Get all visible categories with their menu items, ordered by category order.

**Response:**
```json
[
  {
    "id": "string",
    "name": "المقبلات",
    "description": "مقبلات شهية لفتح الشهية",
    "image": "/appetizers.jpg",
    "order": 1,
    "visible": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "items": [
      {
        "id": "string",
        "name": "حمص بالطحينة",
        "description": "حمص كلاسيكي مع زيت الزيتون والفلفل",
        "price": "15 ريال",
        "categoryId": "string",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
]
```

## Admin Endpoints

### Authentication

#### POST /api/admin/login

Authenticate and receive an access token.

**Request:**
```json
{
  "email": "admin@restaurant.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "admin-token-1234567890"
}
```

**Error Response:**
```json
{
  "error": "Invalid credentials"
}
```

### Restaurant Settings

#### GET /api/admin/settings

Get restaurant settings (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "string",
  "restaurantName": "مطعمنا المميز",
  "logoUrl": "/restaurant-logo.png",
  "primaryColor": "#f59e0b",
  "secondaryColor": "#ea580c",
  "backgroundColor": "#fffbeb",
  "contactPhone": "1234-567-890",
  "contactEmail": "info@restaurant.com",
  "address": "شارع الملك فهد، الرياض",
  "workingHours": "من الساعة 11:00 صباحاً حتى 11:00 مساءً",
  "welcomeText": "مرحباً بك في مطعمنا!",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### PUT /api/admin/settings

Update restaurant settings (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "restaurantName": "مطعمي الجديد",
  "logoUrl": "/new-logo.png",
  "primaryColor": "#059669",
  "secondaryColor": "#047857",
  "backgroundColor": "#ecfdf5",
  "contactPhone": "987-654-3210",
  "contactEmail": "new@restaurant.com",
  "address": "شارع جديد، الرياض",
  "workingHours": "من الساعة 10:00 صباحاً حتى 10:00 مساءً",
  "welcomeText": "مرحباً في مطعمي الجديد!"
}
```

**Response:**
```json
{
  "id": "string",
  "restaurantName": "مطعمي الجديد",
  "logoUrl": "/new-logo.png",
  "primaryColor": "#059669",
  "secondaryColor": "#047857",
  "backgroundColor": "#ecfdf5",
  "contactPhone": "987-654-3210",
  "contactEmail": "new@restaurant.com",
  "address": "شارع جديد، الرياض",
  "workingHours": "من الساعة 10:00 صباحاً حتى 10:00 مساءً",
  "welcomeText": "مرحباً في مطعمي الجديد!",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Categories Management

#### GET /api/admin/categories

Get all categories with their menu items (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "string",
    "name": "المقبلات",
    "description": "مقبلات شهية لفتح الشهية",
    "image": "/appetizers.jpg",
    "order": 1,
    "visible": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "items": [
      {
        "id": "string",
        "name": "حمص بالطحينة",
        "description": "حمص كلاسيكي مع زيت الزيتون والفلفل",
        "price": "15 ريال",
        "categoryId": "string",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
]
```

#### POST /api/admin/categories

Create a new category (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "name": "صوصات",
  "description": "تشكيلة من الصوصات اللذيذة",
  "image": "/sauces.jpg",
  "order": 6,
  "visible": true
}
```

**Response:**
```json
{
  "id": "string",
  "name": "صوصات",
  "description": "تشكيلة من الصوصات اللذيذة",
  "image": "/sauces.jpg",
  "order": 6,
  "visible": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "items": []
}
```

#### GET /api/admin/categories/[id]

Get a specific category by ID (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "string",
  "name": "المقبلات",
  "description": "مقبلات شهية لفتح الشهية",
  "image": "/appetizers.jpg",
  "order": 1,
  "visible": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "items": [
    {
      "id": "string",
      "name": "حمص بالطحينة",
      "description": "حمص كلاسيكي مع زيت الزيتون والفلفل",
      "price": "15 ريال",
      "categoryId": "string",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### PUT /api/admin/categories/[id]

Update a category (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "name": "المقبلات المميزة",
  "description": "أفضل المقبلات الشرقية",
  "image": "/appetizers.jpg",
  "order": 1,
  "visible": true
}
```

**Response:**
```json
{
  "id": "string",
  "name": "المقبلات المميزة",
  "description": "أفضل المقبلات الشرقية",
  "image": "/appetizers.jpg",
  "order": 1,
  "visible": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "items": [...]
}
```

#### DELETE /api/admin/categories/[id]

Delete a category and all its menu items (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Category deleted successfully"
}
```

### Menu Items Management

#### GET /api/admin/items

Get all menu items (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "string",
    "name": "حمص بالطحينة",
    "description": "حمص كلاسيكي مع زيت الزيتون والفلفل",
    "price": "15 ريال",
    "categoryId": "string",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "category": {
      "id": "string",
      "name": "المقبلات"
    }
  }
]
```

#### POST /api/admin/items

Create a new menu item (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "name": "طبق جديد",
  "description": "وصف الطبق الجديد",
  "price": "25 ريال",
  "categoryId": "category-id"
}
```

**Response:**
```json
{
  "id": "string",
  "name": "طبق جديد",
  "description": "وصف الطبق الجديد",
  "price": "25 ريال",
  "categoryId": "category-id",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### GET /api/admin/items/[id]

Get a specific menu item by ID (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "string",
  "name": "حمص بالطحينة",
  "description": "حمص كلاسيكي مع زيت الزيتون والفلفل",
  "price": "15 ريال",
  "categoryId": "string",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### PUT /api/admin/items/[id]

Update a menu item (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "name": "حمص بالطحينة المميز",
  "description": "حمص كلاسيكي مع زيت الزيتون والفلفل وعصير الليمون",
  "price": "18 ريال",
  "categoryId": "category-id"
}
```

**Response:**
```json
{
  "id": "string",
  "name": "حمص بالطحينة المميز",
  "description": "حمص كلاسيكي مع زيت الزيتون والفلفل وعصير الليمون",
  "price": "18 ريال",
  "categoryId": "category-id",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### DELETE /api/admin/items/[id]

Delete a menu item (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Menu item deleted successfully"
}
```

## Error Responses

All endpoints return appropriate HTTP status codes and error messages.

### Common Error Codes

- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Missing or invalid authentication
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

### Error Response Format
```json
{
  "error": "Error message describing what went wrong"
}
```

## Data Models

### RestaurantSettings
```typescript
interface RestaurantSettings {
  id: string;
  restaurantName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  workingHours: string;
  welcomeText: string;
  createdAt: string;
  updatedAt: string;
}
```

### Category
```typescript
interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  order: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
  items?: MenuItem[];
}
```

### MenuItem
```typescript
interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Public endpoints**: 100 requests per minute
- **Admin endpoints**: 60 requests per minute
- **Authentication endpoints**: 10 requests per minute

## Caching

### Response Headers
```
Cache-Control: public, s-maxage=3600, stale-while-revalidate
ETag: "unique-identifier"
```

### Cacheable Endpoints
- `GET /api/settings` - Cached for 1 hour
- `GET /api/menu` - Cached for 30 minutes

## Webhooks

Currently, webhooks are not supported but may be added in future versions for real-time updates.

## SDK Integration

### JavaScript/TypeScript
```typescript
class RestaurantMenuAPI {
  private baseUrl: string;
  private token?: string;

  constructor(baseUrl: string, token?: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  async login(email: string, password: string) {
    const response = await fetch(`${this.baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    this.token = data.token;
    return data;
  }

  async getSettings() {
    const response = await fetch(`${this.baseUrl}/api/settings`);
    return response.json();
  }

  async getMenu() {
    const response = await fetch(`${this.baseUrl}/api/menu`);
    return response.json();
  }

  async updateSettings(settings: Partial<RestaurantSettings>) {
    const response = await fetch(`${this.baseUrl}/api/admin/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify(settings)
    });
    return response.json();
  }
}
```

### Python
```python
import requests
import json

class RestaurantMenuAPI:
    def __init__(self, base_url, token=None):
        self.base_url = base_url
        self.token = token
        self.session = requests.Session()
    
    def login(self, email, password):
        response = self.session.post(
            f"{self.base_url}/api/admin/login",
            json={"email": email, "password": password}
        )
        data = response.json()
        self.token = data.get("token")
        return data
    
    def get_settings(self):
        response = self.session.get(f"{self.base_url}/api/settings")
        return response.json()
    
    def get_menu(self):
        response = self.session.get(f"{self.base_url}/api/menu")
        return response.json()
    
    def update_settings(self, settings):
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.token}"
        }
        response = self.session.put(
            f"{self.base_url}/api/admin/settings",
            json=settings,
            headers=headers
        )
        return response.json()
```

## Testing

### Testing with curl

```bash
# Get settings
curl https://your-domain.com/api/settings

# Get menu
curl https://your-domain.com/api/menu

# Login
curl -X POST https://your-domain.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@restaurant.com","password":"admin123"}'

# Update settings (replace TOKEN with actual token)
curl -X PUT https://your-domain.com/api/admin/settings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"restaurantName":"مطعمي الجديد"}'
```

### Testing with Postman

1. Import the Postman collection
2. Set base URL to your domain
3. Use the login endpoint to get a token
4. Add token to authorization header for admin endpoints

## Versioning

The API uses URI versioning. Current version: v1

```
https://your-domain.com/api/v1/...
```

## Changelog

### v1.0.0 (2024-01-01)
- Initial API release
- Restaurant settings management
- Category management
- Menu item management
- Authentication system

## Support

For API support and questions:
- Create an issue on GitHub
- Check the documentation
- Contact the development team