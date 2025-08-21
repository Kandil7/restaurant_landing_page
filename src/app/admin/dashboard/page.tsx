'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  order: number;
  visible: boolean;
  items: MenuItem[];
}

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: string;
  categoryId: string;
}

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
}

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchCategories();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        alert('تم حفظ الإعدادات بنجاح');
      } else {
        alert('فشل حفظ الإعدادات');
      }
    } catch (error) {
      alert('حدث خطأ في الاتصال');
    }
  };

  const handleSettingsChange = (field: keyof RestaurantSettings, value: string) => {
    if (settings) {
      setSettings({ ...settings, [field]: value });
    }
  };

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin');
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        router.push('/admin');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      router.push('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin');
  };

  const handleToggleCategoryVisibility = async (id: string, visible: boolean) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ visible })
      });

      if (response.ok) {
        fetchCategories(); // Refresh the list
      } else {
        alert('فشل تحديث حالة القسم');
      }
    } catch (error) {
      alert('حدث خطأ في الاتصال');
    }
  };

  const handleReorderCategories = async (id: string, newOrder: number) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ order: newOrder })
      });

      if (response.ok) {
        fetchCategories(); // Refresh the list
      } else {
        alert('فشل تحديث ترتيب القسم');
      }
    } catch (error) {
      alert('حدث خطأ في الاتصال');
    }
  };

  const handleEditCategory = (id: string) => {
    router.push(`/admin/categories/edit/${id}`);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا القسم؟ سيتم حذف جميع الأطباق المرتبطة به.')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchCategories(); // Refresh the list
      } else {
        alert('فشل حذف القسم');
      }
    } catch (error) {
      alert('حدث خطأ في الاتصال');
    }
  };

  const handleEditItem = (id: string) => {
    router.push(`/admin/items/edit/${id}`);
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطبق؟')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/items/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchCategories(); // Refresh the list
      } else {
        alert('فشل حذف الطبق');
      }
    } catch (error) {
      alert('حدث خطأ في الاتصال');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم</h1>
              <p className="text-gray-600 mt-1">إدارة محتوى مطعمنا المميز</p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              تسجيل الخروج
            </Button>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">عدد الأقسام</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">عدد الأطباق</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {categories.reduce((total, cat) => total + cat.items.length, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">الحالة</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                نشط
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="categories" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="categories">إدارة الأقسام</TabsTrigger>
            <TabsTrigger value="items">إدارة الأطباق</TabsTrigger>
            <TabsTrigger value="settings">إعدادات المطعم</TabsTrigger>
          </TabsList>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>الأقسام</CardTitle>
                    <CardDescription>إدارة أقسام المينيو</CardDescription>
                  </div>
                  <Button onClick={() => router.push('/admin/categories/create')}>
                    إضافة قسم جديد
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories
                    .sort((a, b) => a.order - b.order)
                    .map((category, index) => (
                    <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{category.name}</h3>
                          <Badge variant={category.visible ? "default" : "secondary"}>
                            {category.visible ? "مرئي" : "مخفي"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline">
                            {category.items.length} أطباق
                          </Badge>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReorderCategories(category.id, Math.max(0, category.order - 1))}
                              disabled={category.order === 0}
                            >
                              ↑
                            </Button>
                            <span className="text-sm text-gray-500">الترتيب: {category.order + 1}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReorderCategories(category.id, category.order + 1)}
                            >
                              ↓
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleToggleCategoryVisibility(category.id, !category.visible)}
                        >
                          {category.visible ? "إخفاء" : "إظهار"}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditCategory(category.id)}
                        >
                          تعديل
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          حذف
                        </Button>
                      </div>
                    </div>
                  ))}
                  {categories.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      لا توجد أقسام بعد. قم بإضافة قسم جديد للبدء.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="items">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>الأطباق</CardTitle>
                    <CardDescription>إدارة أطباق المينيو</CardDescription>
                  </div>
                  <Button onClick={() => router.push('/admin/items/create')}>
                    إضافة طبق جديد
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.id}>
                      <h3 className="font-semibold mb-3">{category.name}</h3>
                      <div className="space-y-2 ml-4">
                        {category.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-gray-600">{item.description}</p>
                              <Badge variant="outline" className="mt-1">
                                {item.price}
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEditItem(item.id)}
                              >
                                تعديل
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleDeleteItem(item.id)}
                              >
                                حذف
                              </Button>
                            </div>
                          </div>
                        ))}
                        {category.items.length === 0 && (
                          <div className="text-sm text-gray-500 ml-4">
                            لا توجد أطباق في هذا القسم
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {categories.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      لا توجد أقسام بعد. قم بإضافة قسم وأطباق للبدء.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>إعدادات المطعم</CardTitle>
                    <CardDescription>تخصيص معلومات ومظهر المطعم</CardDescription>
                  </div>
                  <Button onClick={handleSaveSettings}>
                    حفظ الإعدادات
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {settings && (
                  <div className="space-y-6">
                    {/* معلومات أساسية */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">المعلومات الأساسية</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="restaurantName">اسم المطعم</Label>
                          <Input
                            id="restaurantName"
                            value={settings.restaurantName}
                            onChange={(e) => handleSettingsChange('restaurantName', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="logoUrl">رابط الشعار</Label>
                          <Input
                            id="logoUrl"
                            value={settings.logoUrl || ''}
                            onChange={(e) => handleSettingsChange('logoUrl', e.target.value)}
                            placeholder="/restaurant-logo.png"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="welcomeText">نص الترحيب</Label>
                        <Textarea
                          id="welcomeText"
                          value={settings.welcomeText}
                          onChange={(e) => handleSettingsChange('welcomeText', e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* الألوان */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">الألوان</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="primaryColor">اللون الرئيسي</Label>
                          <div className="flex gap-2">
                            <Input
                              id="primaryColor"
                              value={settings.primaryColor}
                              onChange={(e) => handleSettingsChange('primaryColor', e.target.value)}
                              placeholder="#f59e0b"
                            />
                            <div 
                              className="w-10 h-10 rounded border"
                              style={{ backgroundColor: settings.primaryColor }}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="secondaryColor">اللون الثانوي</Label>
                          <div className="flex gap-2">
                            <Input
                              id="secondaryColor"
                              value={settings.secondaryColor}
                              onChange={(e) => handleSettingsChange('secondaryColor', e.target.value)}
                              placeholder="#ea580c"
                            />
                            <div 
                              className="w-10 h-10 rounded border"
                              style={{ backgroundColor: settings.secondaryColor }}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="backgroundColor">لون الخلفية</Label>
                          <div className="flex gap-2">
                            <Input
                              id="backgroundColor"
                              value={settings.backgroundColor}
                              onChange={(e) => handleSettingsChange('backgroundColor', e.target.value)}
                              placeholder="#fffbeb"
                            />
                            <div 
                              className="w-10 h-10 rounded border"
                              style={{ backgroundColor: settings.backgroundColor }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* معلومات التواصل */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">معلومات التواصل</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="contactPhone">رقم الهاتف</Label>
                          <Input
                            id="contactPhone"
                            value={settings.contactPhone}
                            onChange={(e) => handleSettingsChange('contactPhone', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="contactEmail">البريد الإلكتروني</Label>
                          <Input
                            id="contactEmail"
                            value={settings.contactEmail}
                            onChange={(e) => handleSettingsChange('contactEmail', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="address">العنوان</Label>
                          <Input
                            id="address"
                            value={settings.address}
                            onChange={(e) => handleSettingsChange('address', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="workingHours">ساعات العمل</Label>
                          <Input
                            id="workingHours"
                            value={settings.workingHours}
                            onChange={(e) => handleSettingsChange('workingHours', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}