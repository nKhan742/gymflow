export class MembershipPlansCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class MembershipPlansUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class MembershipPlansDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
