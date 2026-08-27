export class ReferralsCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class ReferralsUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class ReferralsDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
