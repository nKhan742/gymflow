export class TrainerScheduleCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class TrainerScheduleUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class TrainerScheduleDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
