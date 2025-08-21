'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export default function EditCategoryPage() {
  const [category, setCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    fetchCategory();
  }, [params.id]);

  const fetchCategory = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/categories/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCategory(data);
        setName(data.name);
        setDescription(data.description || '');
        setImage(data.image || '');
      } else {
        router.push('/admin/dashboard');
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      router.push('/admin/dashboard');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/categories/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, description, image }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('تم تحديث القسم بنجاح');
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 1500);
      } else {
        setError(data.error || 'فشل تحديث القسم');
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف هذا القسم؟ سيتم حذف جميع الأطباق المرتبطة به.')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/categories/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        setError('فشل حذف القسم');
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال');
    }
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>تعديل القسم</CardTitle>
            <CardDescription>تعديل معلومات القسم</CardDescription>
          </CardHeader>
          <CardContent>
            {success && (
              <Alert className="mb-4 border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">
                  {success}
                </AlertDescription>
              </Alert>
            )}
            
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم القسم</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">رابط الصورة (اختياري)</Label>
                <Input
                  id="image"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push('/admin/dashboard')}
                >
                  إلغاء
                </Button>
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={handleDelete}
                >
                  حذف القسم
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}