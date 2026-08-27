export class DietPlansCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class DietPlansUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class DietPlansDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
