export class TrainerAnalyticsCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class TrainerAnalyticsUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class TrainerAnalyticsDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
