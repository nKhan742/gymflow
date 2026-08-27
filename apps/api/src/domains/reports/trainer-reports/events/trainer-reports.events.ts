export class TrainerReportsCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class TrainerReportsUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class TrainerReportsDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
