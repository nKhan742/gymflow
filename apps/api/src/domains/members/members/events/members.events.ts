export class MembersCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class MembersUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class MembersDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
