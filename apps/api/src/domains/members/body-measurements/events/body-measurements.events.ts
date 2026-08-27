export class BodyMeasurementsCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class BodyMeasurementsUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class BodyMeasurementsDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
