export class FeatureFlagsCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class FeatureFlagsUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class FeatureFlagsDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
