export class ExerciseLibraryCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class ExerciseLibraryUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class ExerciseLibraryDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
