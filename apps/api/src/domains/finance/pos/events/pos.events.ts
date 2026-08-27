export class PosCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class PosUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class PosDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
