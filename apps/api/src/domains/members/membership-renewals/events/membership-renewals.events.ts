export class MembershipRenewalsCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class MembershipRenewalsUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class MembershipRenewalsDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
