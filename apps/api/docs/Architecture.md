# GymFlow ERP - Backend Architecture Guide

## Clean Architecture & Domain-Driven Design (DDD)

The backend is organized into 14 distinct business domains and 74 feature modules, isolating domain logic, entities, and repositories.

```
Request
  │
  ▼
[Routes / Middleware] (Authentication, RBAC, Validation)
  │
  ▼
[Controller] (Request orchestration, DTO unmarshaling, Response formatting)
  │
  ▼
[Service] (Domain logic, Event dispatching, Transaction coordination)
  │
  ▼
[Repository] (Generic & Specialized Mongoose queries, Multitenant scoping)
  │
  ▼
[Model] (Schema definition with Base Schema, Indexes, Soft delete)
  │
  ▼
[MongoDB Database]
```
