export class ExerciseCategoriesCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class ExerciseCategoriesUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class ExerciseCategoriesDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
