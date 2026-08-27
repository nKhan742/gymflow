# GymFlow ERP - API Design Standards

All endpoints follow RESTful standards and return standardized JSON responses:

```json
{
  "success": true,
  "message": "Resource retrieved successfully",
  "data": { ... },
  "errors": null,
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "totalPages": 15,
    "timestamp": "2026-08-27T12:00:00.000Z"
  }
}
```
