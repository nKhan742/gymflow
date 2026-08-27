export class MemberAnalyticsCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class MemberAnalyticsUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class MemberAnalyticsDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
