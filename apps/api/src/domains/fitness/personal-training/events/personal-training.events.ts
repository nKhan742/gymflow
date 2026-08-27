export class PersonalTrainingCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class PersonalTrainingUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class PersonalTrainingDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
