import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getRestaurantSettings, updateRestaurantSettings } from '@/lib/firebase-service';

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

export default function AdminPanel() {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState('settings');
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const settingsData = await getRestaurantSettings();
        setSettings(settingsData);
        // In a real app, you would also fetch categories here
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSaveSettings = async () => {
    if (!settings) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await updateRestaurantSettings(settings);
      setSuccess('Settings updated successfully!');
    } catch (err) {
      setError('Failed to update settings');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => prev ? { ...prev, [name]: value } : null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">لوحة تحكم المطعم</h1>
        <p className="text-gray-600">إدارة إعدادات المطعم وقائمة الطعام</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="settings">إعدادات المطعم</TabsTrigger>
          <TabsTrigger value="menu">قائمة الطعام</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>معلومات المطعم</CardTitle>
              <CardDescription>تحديث اسم المطعم والشعار</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="restaurantName">اسم المطعم</Label>
                  <Input
                    id="restaurantName"
                    name="restaurantName"
                    value={settings?.restaurantName || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="logoUrl">رابط الشعار</Label>
                  <Input
                    id="logoUrl"
                    name="logoUrl"
                    value={settings?.logoUrl || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="welcomeText">نص الترحيب</Label>
                <Textarea
                  id="welcomeText"
                  name="welcomeText"
                  value={settings?.welcomeText || ''}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>معلومات التواصل</CardTitle>
              <CardDescription>تحديث معلومات التواصل مع المطعم</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactPhone">رقم الهاتف</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={settings?.contactPhone || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">البريد الإلكتروني</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    value={settings?.contactEmail || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">العنوان</Label>
                <Input
                  id="address"
                  name="address"
                  value={settings?.address || ''}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label htmlFor="workingHours">ساعات العمل</Label>
                <Input
                  id="workingHours"
                  name="workingHours"
                  value={settings?.workingHours || ''}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>الإعدادات المرئية</CardTitle>
              <CardDescription>تحديث الألوان والتصميم</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="primaryColor">اللون الأساسي</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="primaryColor"
                      name="primaryColor"
                      type="color"
                      value={settings?.primaryColor || '#f59e0b'}
                      onChange={handleInputChange}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      name="primaryColor"
                      value={settings?.primaryColor || '#f59e0b'}
                      onChange={handleInputChange}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondaryColor">اللون الثانوي</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="secondaryColor"
                      name="secondaryColor"
                      type="color"
                      value={settings?.secondaryColor || '#ea580c'}
                      onChange={handleInputChange}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      name="secondaryColor"
                      value={settings?.secondaryColor || '#ea580c'}
                      onChange={handleInputChange}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="backgroundColor">لون الخلفية</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="backgroundColor"
                      name="backgroundColor"
                      type="color"
                      value={settings?.backgroundColor || '#fffbeb'}
                      onChange={handleInputChange}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      name="backgroundColor"
                      value={settings?.backgroundColor || '#fffbeb'}
                      onChange={handleInputChange}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button 
              onClick={handleSaveSettings} 
              disabled={saving}
              className="px-6"
            >
              {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="menu" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>إدارة قائمة الطعام</CardTitle>
              <CardDescription>إضافة وتعديل وحذف الأقسام والأطباق</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold mb-2">قائمة الطعام</h3>
                <p className="text-gray-600 mb-6">
                  إدارة الأقسام والأطباق وإضافة صور وتعديل الأسعار
                </p>
                <Button>إضافة قسم جديد</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
