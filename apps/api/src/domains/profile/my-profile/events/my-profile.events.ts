export class MyProfileCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class MyProfileUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class MyProfileDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
