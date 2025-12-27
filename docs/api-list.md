# API List - Online House Rental & Tenant Management System
# API List (Structure Only)

## Overview
- Base URL:
- Auth method: JWT (planned)
- Roles: OWNER, TENANT

## Modules
### 1) Auth
- [ ] Register
- [ ] Login
- [ ] Logout (optional)
- [ ] Refresh token (optional)

### 2) Users (optional)
- [ ] Get profile
- [ ] Update profile

### 3) Properties
- [x] Create property (Owner) - POST /api/properties
- [ ] List/Search properties
- [ ] Get property by id
- [ ] Update property (Owner)
- [ ] Delete property (Owner)

### 4) Bookings
- [ ] Create booking request (Tenant)
- [ ] My bookings (Tenant)
- [ ] Owner booking requests (Owner)
- [ ] Approve/Reject booking (Owner)
- [ ] Cancel booking (optional)

## Common Standards (to be filled later)
- Request headers
- Response format
- Error codes

---

## Common Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

---

## HTTP Status Codes Used

| Code | Description |
|------|-------------|
| 200  | OK - Request succeeded |
| 201  | Created - Resource created successfully |
| 400  | Bad Request - Invalid input data |
| 401  | Unauthorized - Authentication required |
| 403  | Forbidden - Insufficient permissions |
| 404  | Not Found - Resource doesn't exist |
| 409  | Conflict - Resource conflict (e.g., duplicate booking) |
| 500  | Internal Server Error - Server error |

---

## Notes for Implementation

1. **Authentication:** All protected routes require valid JWT token
2. **Authorization:** Role-based access control enforced via middleware
3. **Validation:** All inputs validated before processing
4. **Error Handling:** Consistent error format across all endpoints
5. **Pagination:** Consider adding pagination for list endpoints
6. **Rate Limiting:** May be implemented for security

---
