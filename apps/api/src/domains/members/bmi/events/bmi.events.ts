export class BmiCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class BmiUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class BmiDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
