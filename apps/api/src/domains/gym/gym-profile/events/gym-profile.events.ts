export class GymProfileCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class GymProfileUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class GymProfileDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
