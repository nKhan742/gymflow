export class GrowthAnalyticsCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class GrowthAnalyticsUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class GrowthAnalyticsDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
