import React, { useState } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Products created successfully');
      navigate('/inventory/products');
    }, 500);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Create Products"
        subtitle="Configure new products record with validation and role permissions."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/inventory/products')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to List</span>
          </Button>
        }
      />

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Products Details</CardTitle>
              <CardDescription>Fill out the parameters for this products.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Products Title / Name</label>
                <Input
                  placeholder="e.g. Standard Products Protocol"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Category / Domain</label>
                <Input value="Inventory" disabled className="bg-muted text-muted-foreground" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2.5">
              <Button variant="outline" type="button" onClick={() => navigate('/inventory/products')}>
                Cancel
              </Button>
              <Button type="submit" loading={loading} className="gap-1.5">
                <Save className="h-4 w-4" />
                <span>Save Products</span>
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
