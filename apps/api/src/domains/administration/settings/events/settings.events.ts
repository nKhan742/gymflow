export class SettingsCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class SettingsUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class SettingsDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
