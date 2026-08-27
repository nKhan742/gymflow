export class MemberReportsCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class MemberReportsUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class MemberReportsDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
