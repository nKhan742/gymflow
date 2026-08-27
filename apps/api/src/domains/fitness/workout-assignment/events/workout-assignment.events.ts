export class WorkoutAssignmentCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class WorkoutAssignmentUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class WorkoutAssignmentDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
