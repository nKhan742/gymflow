export class WaterIntakeCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class WaterIntakeUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class WaterIntakeDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
