export class WorkoutTemplatesCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class WorkoutTemplatesUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class WorkoutTemplatesDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
