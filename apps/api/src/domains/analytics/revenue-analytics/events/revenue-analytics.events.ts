export class RevenueAnalyticsCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class RevenueAnalyticsUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class RevenueAnalyticsDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
