export class FreezeMembershipCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class FreezeMembershipUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class FreezeMembershipDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
