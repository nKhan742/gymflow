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
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Trainer Commission created successfully');
      navigate('/finance/trainer-commission');
    }, 500);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Create Trainer Commission"
        subtitle="Configure new trainer commission record with validation and role permissions."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/finance/trainer-commission')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to List</span>
          </Button>
        }
      />

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Trainer Commission Details</CardTitle>
              <CardDescription>Fill out the parameters for this trainer commission.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Trainer Commission Title / Name</label>
                <Input
                  placeholder="e.g. Standard Trainer Commission Protocol"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Category / Domain</label>
                <Input value="Finance" disabled className="bg-muted text-muted-foreground" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2.5">
              <Button variant="outline" type="button" onClick={() => navigate('/finance/trainer-commission')}>
                Cancel
              </Button>
              <Button type="submit" loading={loading} className="gap-1.5">
                <Save className="h-4 w-4" />
                <span>Save Trainer Commission</span>
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
