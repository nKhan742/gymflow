export class DiscountsCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class DiscountsUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class DiscountsDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
