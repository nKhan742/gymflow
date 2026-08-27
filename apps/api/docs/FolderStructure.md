# GymFlow ERP - Backend Folder Structure

```
apps/api/
├── src/
│   ├── config/              # App, DB, Redis, Mail, Storage configuration
│   ├── core/                # Auth, Exceptions, Loggers, Middleware, RBAC
│   ├── database/            # Database Connection, BaseModel, BaseRepository
│   ├── shared/              # BaseController, BaseService, BaseResponse
│   ├── domains/             # 14 Business Domains (74 Feature Modules)
│   ├── routes/              # Central Route Registry
│   ├── app.ts               # Express App definition
│   └── server.ts            # Server Entry Point
```
