import React, { useState, useEffect } from 'react';
import { PageContainer } from '../../../../shared/layouts/PageContainer';
import { PageHeader } from '../../../../shared/layouts/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../shared/components/ui/card';
import { Button } from '../../../../shared/components/ui/button';
import { Input } from '../../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/components/ui/select';
import { ImageUpload } from '../../../../shared/components/image-upload';
import { ArrowLeft, Save, MessageCircle, Sparkles, Plus, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useBranchStore } from '../../../../core/store/branchStore';
import { IWhatsappTemplate, IWhatsappButton } from '../types';
import { STORAGE_KEYS } from '../../../../core/constants/storageKeys';

export const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branchOptions } = useBranchStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [fetching, setFetching] = useState(true);

  // Form State
  const [templateName, setTemplateName] = useState('');
  const [category, setCategory] = useState<IWhatsappTemplate['category']>('UTILITY');
  const [language, setLanguage] = useState('en_US');
  const [headerType, setHeaderType] = useState<IWhatsappTemplate['headerType']>('IMAGE');
  const [headerMediaUrl, setHeaderMediaUrl] = useState<string | undefined>(undefined);
  const [bodyText, setBodyText] = useState('');
  const [footerText, setFooterText] = useState('');
  const [buttons, setButtons] = useState<IWhatsappButton[]>([]);
  const [metaApprovalStatus, setMetaApprovalStatus] = useState<IWhatsappTemplate['metaApprovalStatus']>('APPROVED');
  const [qualityRating, setQualityRating] = useState<IWhatsappTemplate['qualityRating']>('HIGH');
  const [branchId, setBranchId] = useState(branchOptions[0]?.value || 'BR-274');

  useEffect(() => {
    loadTemplate();
  }, [id]);

  const loadTemplate = async () => {
    setFetching(true);
    try {
      const stored = localStorage.getItem('gymflow_custom_whatsapp');
      if (stored) {
        const customList: IWhatsappTemplate[] = JSON.parse(stored);
        const match = customList.find((t) => (t.id || t._id) === id);
        if (match) {
          populateFields(match);
          setFetching(false);
          return;
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const res = await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/communication/whatsapp/${id}`, {
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
      id: id || 'WA-101',
      _id: id || 'WA-101',
      templateName: 'member_turnstile_pass_active',
      category: 'UTILITY',
      language: 'en_US',
      headerType: 'IMAGE',
      headerMediaUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop&q=80',
      bodyText: 'Hello {{1}}, your GymFlow digital access pass is active for today. Your assigned locker code is {{2}}. Please scan your QR code at turnstile gate 1.',
      footerText: 'GymFlow Concierge • Tap button to view live locker PIN',
      buttons: [
        { type: 'QUICK_REPLY', text: '🎟️ View QR Code' },
        { type: 'URL', text: '📅 Book Class', value: 'https://gymflow.io/book' },
      ],
      metaApprovalStatus: 'APPROVED',
      qualityRating: 'HIGH',
      messagesSent: 2840,
      readRate: 97.4,
      responseRate: 44.8,
      branchName: 'Main Facility',
      createdAt: '2026-08-25T08:00:00.000Z',
      updatedAt: '2026-08-25T08:00:00.000Z',
    });
    setFetching(false);
  };

  const populateFields = (tpl: IWhatsappTemplate) => {
    setTemplateName(tpl.templateName || '');
    setCategory(tpl.category || 'UTILITY');
    setLanguage(tpl.language || 'en_US');
    setHeaderType(tpl.headerType || 'IMAGE');
    setHeaderMediaUrl(tpl.headerMediaUrl);
    setBodyText(tpl.bodyText || '');
    setFooterText(tpl.footerText || '');
    setButtons(tpl.buttons || []);
    setMetaApprovalStatus(tpl.metaApprovalStatus || 'APPROVED');
    setQualityRating(tpl.qualityRating || 'HIGH');
    if (tpl.branchId) setBranchId(tpl.branchId);
  };

  const handleAddButton = () => {
    if (buttons.length >= 3) {
      toast.error('Maximum 3 buttons allowed by Meta WhatsApp Business API');
      return;
    }
    setButtons([...buttons, { type: 'QUICK_REPLY', text: '💬 Chat with Coach' }]);
  };

  const handleRemoveButton = (idx: number) => {
    setButtons(buttons.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const updatedTemplate: Partial<IWhatsappTemplate> = {
      templateName: templateName.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
      category,
      language,
      headerType,
      headerMediaUrl,
      bodyText,
      footerText,
      buttons,
      metaApprovalStatus,
      qualityRating,
      branchId,
      branchName: branchOptions.find((b) => b.value === branchId)?.label?.replace('🏢 ', '') || 'Main Facility',
      updatedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('gymflow_custom_whatsapp');
      if (stored) {
        const customList: IWhatsappTemplate[] = JSON.parse(stored);
        const index = customList.findIndex((item) => (item.id || item._id) === id);
        if (index >= 0) {
          customList[index] = { ...customList[index], ...updatedTemplate } as IWhatsappTemplate;
          localStorage.setItem('gymflow_custom_whatsapp', JSON.stringify(customList));
        } else {
          customList.unshift({ id: id || 'WA-101', ...updatedTemplate } as IWhatsappTemplate);
          localStorage.setItem('gymflow_custom_whatsapp', JSON.stringify(customList));
        }
      }

      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      await fetch(`https://gymflow-api-2jdh.onrender.com/api/v1/communication/whatsapp/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTemplate),
      }).catch(() => {});

      toast.success(`WhatsApp Template #${id} updated!`);
      navigate('/communication/whatsapp');
    } catch {
      toast.error('Failed to update WhatsApp template');
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
        title={`Edit WhatsApp Template #${id || '101'}`}
        subtitle="Modify template identifiers, header media URL, body parameters, and interactive buttons."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate('/communication/whatsapp')}>
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to WhatsApp</span>
          </Button>
        }
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Template Metadata & Header Media */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-emerald-500" />
                Template Identity & Header Media
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">WhatsApp Header Image</label>
                  <ImageUpload
                    value={headerMediaUrl}
                    onChange={(url) => setHeaderMediaUrl(url)}
                    variant="card"
                    helperText="Upload top media banner for WhatsApp message preview"
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Template Identifier (lowercase_with_underscores) <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
                      className="font-mono"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Meta Category</label>
                      <Select value={category} onValueChange={(val) => setCategory(val as IWhatsappTemplate['category'])}>
                        <SelectTrigger>
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTILITY">⚙️ Utility (Access, Bookings)</SelectItem>
                          <SelectItem value="MARKETING">📢 Marketing & Promotions</SelectItem>
                          <SelectItem value="AUTHENTICATION">🔐 Authentication (OTP)</SelectItem>
                          <SelectItem value="SERVICE">💬 Customer Service</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Language Locale</label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger>
                          <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en_US">🇺🇸 English (US)</SelectItem>
                          <SelectItem value="en_GB">🇬🇧 English (UK)</SelectItem>
                          <SelectItem value="es_ES">🇪🇸 Spanish</SelectItem>
                          <SelectItem value="fr_FR">🇫🇷 French</SelectItem>
                          <SelectItem value="ar_AE">🇦🇪 Arabic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Body Copy, Footer & Interactive Buttons */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Message Body Copy & Action Buttons
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Body Text (Use {'{{1}}'}, {'{{2}}'} for dynamic parameters) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  className="w-full rounded-md border border-input bg-background p-3 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Footer Disclaimer / Concierge Text</label>
                <Input
                  value={footerText}
                  onChange={(e) => setFooterText(e.target.value)}
                  placeholder="e.g. GymFlow Concierge • Reply STOP to unsubscribe"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">Interactive Buttons (Up to 3)</label>
                  {buttons.length < 3 && (
                    <Button type="button" variant="outline" size="sm" onClick={handleAddButton} className="gap-1 text-xs h-7">
                      <Plus className="h-3 w-3" />
                      <span>Add Button</span>
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  {buttons.map((btn, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-muted/40 border border-border">
                      <Select
                        value={btn.type}
                        onValueChange={(val) => {
                          const updated = [...buttons];
                          updated[index].type = val as IWhatsappButton['type'];
                          setButtons(updated);
                        }}
                      >
                        <SelectTrigger className="w-[140px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="QUICK_REPLY">💬 Quick Reply</SelectItem>
                          <SelectItem value="URL">🔗 Web URL</SelectItem>
                          <SelectItem value="PHONE_NUMBER">📞 Phone Call</SelectItem>
                        </SelectContent>
                      </Select>

                      <Input
                        placeholder="Button label text"
                        value={btn.text}
                        onChange={(e) => {
                          const updated = [...buttons];
                          updated[index].text = e.target.value;
                          setButtons(updated);
                        }}
                        className="h-8 text-xs flex-1"
                        required
                      />

                      {btn.type !== 'QUICK_REPLY' && (
                        <Input
                          placeholder={btn.type === 'URL' ? 'https://gymflow.io/link' : '+15550192834'}
                          value={btn.value || ''}
                          onChange={(e) => {
                            const updated = [...buttons];
                            updated[index].value = e.target.value;
                            setButtons(updated);
                          }}
                          className="h-8 text-xs flex-1 font-mono"
                          required
                        />
                      )}

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-rose-500 hover:bg-rose-500/10"
                        onClick={() => handleRemoveButton(index)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t border-border pt-4 bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Template ID: <strong className="font-mono text-foreground">{id || 'WA-101'}</strong>
              </span>
              <div className="flex gap-2.5">
                <Button variant="outline" type="button" onClick={() => navigate('/communication/whatsapp')}>
                  Cancel
                </Button>
                <Button type="submit" loading={loading} className="gap-1.5 shadow-sm bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Save className="h-4 w-4" />
                  <span>Update Template</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageContainer>
  );
};
