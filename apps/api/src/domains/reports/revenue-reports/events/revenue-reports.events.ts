export class RevenueReportsCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class RevenueReportsUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class RevenueReportsDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
