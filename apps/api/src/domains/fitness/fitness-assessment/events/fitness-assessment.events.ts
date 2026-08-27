export class FitnessAssessmentCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class FitnessAssessmentUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class FitnessAssessmentDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
