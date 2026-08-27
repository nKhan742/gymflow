export class TrainerCommissionCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class TrainerCommissionUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class TrainerCommissionDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
