export class PreferencesCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class PreferencesUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class PreferencesDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
