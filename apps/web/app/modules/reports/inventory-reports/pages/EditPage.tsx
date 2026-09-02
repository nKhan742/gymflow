import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, Package, DollarSign, Building2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IInventoryReport } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [reportTitle, setReportTitle] = useState('');
  const [reportingPeriod, setReportingPeriod] = useState<IInventoryReport['reportingPeriod']>('MONTHLY');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState<string | undefined>(undefined);
  const [totalStockSKUs, setTotalStockSKUs] = useState(0);
  const [totalUnitsInStock, setTotalUnitsInStock] = useState(0);
  const [totalValuationCost, setTotalValuationCost] = useState(0);
  const [totalRetailValue, setTotalRetailValue] = useState(0);
  const [cogsSold, setCogsSold] = useState(0);
  const [stockTurnoverRatio, setStockTurnoverRatio] = useState(4.0);
  const [shrinkageRate, setShrinkageRate] = useState(0.5);
  const [auditedBy, setAuditedBy] = useState('');
  const [status, setStatus] = useState<IInventoryReport['status']>('AUDITED');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-01');

  useEffect(() => {
    loadReport();
  }, [id]);

  const loadReport = async () => {
    setFetching(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_inventory_reports');
      if (stored) {
        const customList: IInventoryReport[] = JSON.parse(stored);
        const match = customList.find((r) => (r.id || r._id) === id);
        if (match) {
          populateFields(match);
          setFetching(false);
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
          populateFields(json.data);
          setFetching(false);
          return;
        }
      }
    } catch {}

    populateFields({
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
    setFetching(false);
  };

  const populateFields = (rep: IInventoryReport) => {
    setReportTitle(rep.reportTitle || '');
    setReportingPeriod(rep.reportingPeriod || 'MONTHLY');
    setStartDate(rep.startDate || '');
    setEndDate(rep.endDate || '');
    setCategoryName(rep.categoryName || '');
    setCategoryImage(rep.categoryImage);
    setTotalStockSKUs(rep.totalStockSKUs || 0);
    setTotalUnitsInStock(rep.totalUnitsInStock || 0);
    setTotalValuationCost(rep.totalValuationCost || 0);
    setTotalRetailValue(rep.totalRetailValue || 0);
    setCogsSold(rep.cogsSold || 0);
    setStockTurnoverRatio(rep.stockTurnoverRatio || 4.0);
    setShrinkageRate(rep.shrinkageRate || 0.5);
    setAuditedBy(rep.auditedBy || '');
    setStatus(rep.status || 'AUDITED');
    if (rep.branchId) setBranchId(rep.branchId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedReport: Partial<IInventoryReport> = {
      reportTitle,
      reportingPeriod,
      startDate,
      endDate,
      categoryName,
      categoryImage,
      totalStockSKUs,
      totalUnitsInStock,
      totalValuationCost,
      totalRetailValue,
      cogsSold,
      stockTurnoverRatio,
      shrinkageRate,
      auditedBy,
      status,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'Downtown Flagship',
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_inventory_reports');
      if (stored) {
        const customList: IInventoryReport[] = JSON.parse(stored);
        const index = customList.findIndex((item) => (item.id || item._id) === id);
        if (index >= 0) {
          customList[index] = { ...customList[index], ...updatedReport } as IInventoryReport;
          localStorage.setItem('gymflow_custom_inventory_reports', JSON.stringify(customList));
        } else {
          customList.unshift({ id: id || 'INV-101', ...updatedReport } as IInventoryReport);
          localStorage.setItem('gymflow_custom_inventory_reports', JSON.stringify(customList));
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/reports/inventory-reports/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedReport),
      }).catch(() => {});

      toast.success(`Inventory report #${id} updated!`);
      navigate('/reports/inventory-reports');
    } catch {
      toast.error('Failed to update inventory report');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
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
        title={`Edit Inventory Audit #${id || '101'}`}
        subtitle="Modify stock SKU levels, cost vs retail valuation, cost of goods sold, and turnover ratios."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/reports/inventory-reports')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Reports</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                Category Department, Hero Asset & Time Window
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">Category Visual Banner</label>
                  <ImageUpload
                    value={categoryImage}
                    onChange={(url) => setCategoryImage(url)}
                    variant="card"
                    helperText="Upload photo of product stock category"
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Report Title / Statement Descriptor <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      value={reportTitle}
                      onChange={(e) => setReportTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Stock Category / Department</label>
                    <Input
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Audited By (Controller)</label>
                      <Input
                        value={auditedBy}
                        onChange={(e) => setAuditedBy(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Cadence</label>
                      <Select value={reportingPeriod} onValueChange={(val) => setReportingPeriod(val as IInventoryReport['reportingPeriod'])}>
                        <SelectTrigger>
                          <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MONTHLY">📈 Monthly Stock Audit</SelectItem>
                          <SelectItem value="QUARTERLY">📑 Quarterly Stocktake</SelectItem>
                          <SelectItem value="ANNUAL">🏛️ Annual Fiscal Ledger</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Start Date</label>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">End Date</label>
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-500" />
                Valuation, COGS & Stock Turnover Telemetry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Active SKUs</label>
                  <Input
                    type="number"
                    value={totalStockSKUs}
                    onChange={(e) => setTotalStockSKUs(parseInt(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Total Units In Stock</label>
                  <Input
                    type="number"
                    value={totalUnitsInStock}
                    onChange={(e) => setTotalUnitsInStock(parseInt(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Cost Valuation ($)</label>
                  <Input
                    type="number"
                    value={totalValuationCost}
                    onChange={(e) => setTotalValuationCost(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-emerald-600">Retail Value ($)</label>
                  <Input
                    type="number"
                    value={totalRetailValue}
                    onChange={(e) => setTotalRetailValue(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">COGS Sold ($)</label>
                  <Input
                    type="number"
                    value={cogsSold}
                    onChange={(e) => setCogsSold(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-blue-600">Turnover Velocity Ratio (x)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={stockTurnoverRatio}
                    onChange={(e) => setStockTurnoverRatio(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-rose-500">Shrinkage / Variance Rate %</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={shrinkageRate}
                    onChange={(e) => setShrinkageRate(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Stocktake Audit Status</label>
                  <Select value={status} onValueChange={(val) => setStatus(val as IInventoryReport['status'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AUDITED">🟢 Stock Audited & Reconciled</SelectItem>
                      <SelectItem value="VARIANCE_FLAGGED">🔴 Discrepancy / Variance Flagged</SelectItem>
                      <SelectItem value="IN_PROGRESS">⏳ Active Physical Count</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-blue-500" /> Campus Branch Scope
                  </label>
                  <Select value={branchId} onValueChange={setBranchId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branchOptions.map((b) => (
                        <SelectItem key={b.value} value={b.value}>
                          {b.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border pt-4 bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Report ID: <strong className="font-mono text-foreground">{id || 'INV-101'}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/reports/inventory-reports')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm">
                  <Save className="h-4 w-4" />
                  <span>Update Report</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
