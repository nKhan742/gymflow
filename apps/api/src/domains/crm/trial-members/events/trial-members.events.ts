export class TrialMembersCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class TrialMembersUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class TrialMembersDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
