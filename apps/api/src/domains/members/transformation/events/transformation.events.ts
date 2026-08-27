export class TransformationCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class TransformationUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class TransformationDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
