import { z } from 'zod';

export const createPurchasesSchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  purchaseOrderNumber: z.string().optional(),
  supplierId: z.string().optional(),
  supplierCode: z.string().optional(),
  supplierName: z.string().optional(),
  orderDate: z.union([z.string(), z.date()]).optional(),
  expectedDeliveryDate: z.union([z.string(), z.date()]).optional(),
  itemCount: z.union([z.number(), z.string()]).optional(),
  items: z.array(z.record(z.unknown())).optional(),
  subtotal: z.union([z.number(), z.string()]).optional(),
  tax: z.union([z.number(), z.string()]).optional(),
  shippingCost: z.union([z.number(), z.string()]).optional(),
  totalAmount: z.union([z.number(), z.string()]).optional(),
  currency: z.string().optional(),
  paymentStatus: z.enum(['PAID', 'PENDING', 'OVERDUE', 'PARTIAL']).optional(),
  orderStatus: z.enum(['RECEIVED', 'IN_TRANSIT', 'ORDERED', 'CANCELLED']).optional(),
  receivedDate: z.union([z.string(), z.date()]).optional(),
  receivedBy: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending', 'suspended', 'archived']).default('active'),
  metadata: z.record(z.unknown()).optional(),
}).passthrough();

export const updatePurchasesSchema = createPurchasesSchema.partial();
