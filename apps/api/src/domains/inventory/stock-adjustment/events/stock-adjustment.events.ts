export class StockAdjustmentCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class StockAdjustmentUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class StockAdjustmentDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
