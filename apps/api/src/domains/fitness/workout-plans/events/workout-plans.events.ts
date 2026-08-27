export class WorkoutPlansCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class WorkoutPlansUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class WorkoutPlansDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
