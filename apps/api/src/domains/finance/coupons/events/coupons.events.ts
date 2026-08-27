export class CouponsCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class CouponsUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class CouponsDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
