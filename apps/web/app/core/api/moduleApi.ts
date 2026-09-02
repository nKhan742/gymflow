import { STORAGE_KEYS } from '../constants/storageKeys';

export interface IDbRecord {
  id: string;
  _id?: string;
  name: string;
  code?: string;
  description?: string;
  status: 'active' | 'inactive' | 'archived' | 'draft' | 'suspended' | string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface IModuleDataResult {
  items: IDbRecord[];
  total: number;
  activeCount: number;
  activeRate: string;
}

export const moduleApi = {
  async fetchSubmoduleData(domain: string, submodule: string): Promise<IModuleDataResult> {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const url = `https://gymflow-api-2jdh.onrender.com/api/v1/${domain}/${submodule}`;

      const res = await fetch(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const json = await res.json();
        const rawItems: any[] = json.data?.items || (Array.isArray(json.data) ? json.data : []);

        const items: IDbRecord[] = rawItems.map((item) => ({
          id: item.id || item._id || item.code || item.memberCode || item.invoiceNumber || item.sku || 'REC-001',
          name: item.name || item.title || item.memberName || (item.firstName ? `${item.firstName} ${item.lastName || ''}`.trim() : item.code || 'Record Item'),
          code: item.code || item.memberCode || item.invoiceNumber || item.sku || `REC-${Math.floor(100 + Math.random() * 900)}`,
          description: item.description || item.goal || item.category || item.email || item.supplier || 'Active database record',
          status: item.status || item.memberStatus || item.paymentStatus || 'active',
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: item.updatedAt || new Date().toISOString(),
          ...item,
        }));

        const localCustomRaw = localStorage.getItem(`gymflow_custom_${domain}_${submodule}`) || localStorage.getItem(`gymflow_custom_${submodule}`);
        const localCustomItems: any[] = localCustomRaw ? JSON.parse(localCustomRaw) : [];

        const allItems = [...localCustomItems, ...items];
        const total = allItems.length;
        const activeCount = allItems.filter((i) =>
          String(i.status).toLowerCase().includes('act') || String(i.status).toLowerCase().includes('paid')
        ).length;
        const activeRate = total > 0 ? `${Math.round((activeCount / total) * 100)}%` : '100%';

        return {
          items: allItems,
          total,
          activeCount,
          activeRate,
        };
      }
    } catch {
      // Graceful fallback
    }

    const localCustomRaw = localStorage.getItem(`gymflow_custom_${domain}_${submodule}`) || localStorage.getItem(`gymflow_custom_${submodule}`);
    const localCustomItems: any[] = localCustomRaw ? JSON.parse(localCustomRaw) : [];

    const activeCount = localCustomItems.filter((i) =>
      String(i.status).toLowerCase().includes('act') || String(i.status).toLowerCase().includes('paid')
    ).length;
    const total = localCustomItems.length;
    const activeRate = total > 0 ? `${Math.round((activeCount / total) * 100)}%` : '0%';

    return {
      items: localCustomItems,
      total,
      activeCount,
      activeRate,
    };
  },
};

