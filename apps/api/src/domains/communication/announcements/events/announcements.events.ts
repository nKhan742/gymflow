export class AnnouncementsCreatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class AnnouncementsUpdatedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}

export class AnnouncementsDeletedEvent {
  constructor(public readonly id: string, public readonly tenantId: string) {}
}
