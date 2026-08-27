export class CampaignsCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class CampaignsUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class CampaignsDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
