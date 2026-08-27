import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../layouts/PageContainer';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowLeft, Edit, Database, Calendar, CheckCircle2, FileText, Activity } from 'lucide-react';
import { moduleApi, IDbRecord } from '../../../core/api/moduleApi';

interface IModuleDetailViewProps {
  title: string;
  domain: string;
  submodule: string;
}

export const ModuleDetailView: React.FC<IModuleDetailViewProps> = ({
  title,
  domain,
  submodule,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<IDbRecord | null>(null);

  useEffect(() => {
    loadRecord();
  }, [id, domain, submodule]);

  const loadRecord = async () => {
    const result = await moduleApi.fetchSubmoduleData(domain, submodule);
    const match = result.items.find((i) => i.id === id || i.code === id || i._id === id);
    setRecord(match || result.items[0]);
  };

  if (!record) return null;

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => navigate(`/${domain}/${submodule}`)}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to {title} List</span>
        </Button>
        <Badge variant="outline" className="font-mono text-xs">
          MongoDB Document: {record.code || record.id}
        </Badge>
      </div>

      {/* Record Hero Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/25 shrink-0">
            <Database className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-bold text-foreground">{record.name}</h1>
              <Badge variant="success" className="text-xs capitalize">
                {record.status || 'Active'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{record.description}</p>
          </div>
        </div>

        <Button
          size="sm"
          className="gap-1.5 shadow-md shadow-primary/25"
          onClick={() => navigate(`/${domain}/${submodule}/${id}/edit`)}
        >
          <Edit className="h-4 w-4" />
          <span>Edit {title}</span>
        </Button>
      </div>

      {/* Detail Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Entity Attributes & Metadata</CardTitle>
            <CardDescription>Persistent fields stored in MongoDB</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Unique Identifier:</span>
              <span className="font-mono font-semibold text-foreground">{record.code || record.id}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Domain Context:</span>
              <span className="font-semibold text-primary">{domain} / {submodule}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Lifecycle Status:</span>
              <span className="font-semibold text-emerald-500 uppercase">{record.status || 'Active'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Multi-Tenant Scoping:</span>
              <span className="font-mono text-muted-foreground">tenant_enterprise_01 (HQ)</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Audit Trail & Telemetry</CardTitle>
            <CardDescription>Database write & modification timestamps</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Created At:</span>
              <span className="font-medium text-foreground">
                {record.createdAt && record.createdAt.includes('T') ? new Date(record.createdAt).toLocaleString() : record.createdAt || 'Initial Seed'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Last Modified:</span>
              <span className="font-medium text-foreground">
                {record.updatedAt && record.updatedAt.includes('T') ? new Date(record.updatedAt).toLocaleString() : record.updatedAt || 'Recent'}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Database Indexing:</span>
              <Badge variant="success" className="text-[10px]">Indexed & Synced</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

