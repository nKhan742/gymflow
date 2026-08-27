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
      toast.success('Attendance created successfully');
      navigate('/member-management/attendance');
    }, 500);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Create Attendance"
        subtitle="Configure new attendance record with validation and role permissions."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/member-management/attendance')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to List</span>
          </Button>
        }
      />

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Attendance Details</CardTitle>
              <CardDescription>Fill out the parameters for this attendance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Attendance Title / Name</label>
                <Input
                  placeholder="e.g. Standard Attendance Protocol"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Category / Domain</label>
                <Input value="Member Management" disabled className="bg-muted text-muted-foreground" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2.5">
              <Button variant="outline" type="button" onClick={() => navigate('/member-management/attendance')}>
                Cancel
              </Button>
              <Button type="submit" loading={loading} className="gap-1.5">
                <Save className="h-4 w-4" />
                <span>Save Attendance</span>
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
