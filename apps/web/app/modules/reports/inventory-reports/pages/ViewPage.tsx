import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Badge } from '../../../../shared/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../shared/components/ui/avatar';
import { ArrowLeft, Edit, Package, Calendar, DollarSign, TrendingUp, ShieldCheck, CheckCircle2, Building2, Printer, Layers } from 'lucide-react';
import { IInventoryReport } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const ViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<IInventoryReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, [id]);

  const loadReport = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_inventory_reports');
      if (stored) {
        const customList: IInventoryReport[] = JSON.parse(stored);
        const match = customList.find((r) => (r.id || r._id) === id);
        if (match) {
          setReport(match);
          setLoading(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/reports/inventory-reports/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setReport(json.data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setReport({
      id: id || 'INV-101',
      _id: id || 'INV-101',
      reportTitle: 'Monthly Pro Shop, Supplements & Spares Valuation Audit',
      reportingPeriod: 'MONTHLY',
      startDate: '2026-08-01',
      endDate: '2026-08-31',
      categoryName: 'Supplements & Sports Nutrition',
      categoryImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80',
      totalStockSKUs: 48,
      totalUnitsInStock: 1420,
      totalValuationCost: 28500,
      totalRetailValue: 45600,
      cogsSold: 12400,
      stockTurnoverRatio: 4.2,
      shrinkageRate: 0.8,
      auditedBy: 'Elena Rostova (Inventory Controller)',
      status: 'AUDITED',
      branchName: 'Downtown Flagship',
      createdAt: '2026-08-25T08:00:00.000Z',
      updatedAt: '2026-08-25T08:00:00.000Z',
    });
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !report) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={`${report.categoryName} — Valuation & Stocktake Audit`}
        subtitle={`Scope: ${report.reportTitle} • Audited by ${report.auditedBy}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/reports/inventory-reports')}>
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Reports</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={handlePrint}>
              <Printer className="h-3.5 w-3.5" />
              <span>Print Audit</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate(`/reports/inventory-reports/${report.id || report._id}/edit`)}
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Edit Audit</span>
            </Button>
          </div>
        }
      />

      {/* 4 Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">COST VALUATION</span>
            <Package className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold font-mono text-foreground mt-1">${report.totalValuationCost.toLocaleString()} USD</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">{report.totalUnitsInStock.toLocaleString()} total units on floor</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">RETAIL VALUE</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">${report.totalRetailValue.toLocaleString()} USD</p>
          <p className="text-[11px] text-emerald-600 font-bold mt-0.5">${(report.totalRetailValue - report.totalValuationCost).toLocaleString()} unrealized margin</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">TURNOVER VELOCITY</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">{report.stockTurnoverRatio}x / Year</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">${report.cogsSold.toLocaleString()} COGS Sold</p>
        </Card>

        <Card className="p-4 bg-card border border-border/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">SHRINKAGE / VARIANCE</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold font-mono text-foreground mt-1">{report.shrinkageRate}%</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Asset security approved</p>
        </Card>
      </div>

      {/* Inventory Statement Dossier Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  Inventory Valuation & COGS Ledger
                </CardTitle>
                <CardDescription className="text-xs">
                  Physical count reconciliation, cost vs retail spread, and inventory turnover efficiency
                </CardDescription>
              </div>
              <Badge variant="success" className="text-xs font-bold font-mono">
                {report.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="divide-y divide-border border border-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-3.5 bg-muted/20">
                <span className="text-xs font-semibold text-foreground">1. Total Stockkeeping Units (SKUs) In Category</span>
                <span className="font-mono font-bold text-xs text-foreground">
                  {report.totalStockSKUs} Active SKUs
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5 bg-muted/20">
                <span className="text-xs font-semibold text-foreground">2. Total Physical Units Counted In Warehouse</span>
                <span className="font-mono font-bold text-xs text-foreground">
                  {report.totalUnitsInStock.toLocaleString()} Units
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5 bg-muted/20">
                <span className="text-xs font-semibold text-foreground">3. Realized Cost of Goods Sold (COGS)</span>
                <span className="font-mono font-bold text-xs text-foreground">
                  ${report.cogsSold.toLocaleString()} USD
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5 bg-muted/20">
                <span className="text-xs font-semibold text-foreground">4. Stock Turnover Velocity Ratio</span>
                <span className="font-mono font-bold text-xs text-blue-600">
                  {report.stockTurnoverRatio}x Turn Rate
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-emerald-500/10 font-bold">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider">TOTAL BALANCE SHEET COST VALUE</span>
                <span className="font-mono text-sm text-emerald-600 dark:text-emerald-400">
                  ${report.totalValuationCost.toLocaleString()} USD
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category & Auditor Card */}
        <Card className="h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Department Sign-Off
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-32 rounded-xl overflow-hidden border border-border bg-muted">
              <img
                src={report.categoryImage}
                alt={report.categoryName}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="p-3 bg-muted/40 rounded-xl border border-border space-y-1">
              <h4 className="text-xs font-bold text-foreground">{report.categoryName}</h4>
              <p className="text-[11px] text-muted-foreground font-mono">Auditor: {report.auditedBy}</p>
              <Badge variant="outline" className="text-[9px] font-bold mt-1 text-emerald-600 border-emerald-500/30">
                Reconciliation Complete
              </Badge>
            </div>

            <div className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <p>
                Counted using barcode RFID scanning and verified against ERP purchase orders and POS sales logs.
              </p>
              <div className="pt-2 border-t border-border space-y-1 font-mono text-[10px]">
                <div>Report ID: <strong>{report.id || report._id}</strong></div>
                <div>Campus: <strong>{report.branchName || 'Downtown Flagship'}</strong></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};
