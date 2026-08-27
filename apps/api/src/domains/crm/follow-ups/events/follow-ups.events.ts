export class FollowUpsCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class FollowUpsUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class FollowUpsDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
