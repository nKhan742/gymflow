# GymFlow ERP - Backend Coding Standards

1. Never access Mongoose models directly in Controllers. Always use Repositories.
2. Every business entity must extend `BaseModel` with `tenantId` and `isDeleted`.
3. Every endpoint must be protected with granular permission middlewares.
4. All inputs must be validated with Zod schemas.
