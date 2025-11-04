# API Testing Guide

This document provides examples for testing the Q-Persona API endpoints.

## Prerequisites

- The development server must be running: `npm run dev`
- Use tools like `curl`, Postman, or any HTTP client
- All endpoints return JSON responses

## Base URL

```
http://localhost:3000/api
```

## Authentication and Authorization

Q-Persona uses workspace-based authentication with Role-Based Access Control (RBAC).

### Request Headers

All authenticated API requests should include:

```bash
Authorization: Bearer <token>
X-Workspace-ID: <workspace-uuid>
X-User-Role: <viewer|editor|admin>
```

### Workspace Role Codes

| Role Code | Level | Permissions |
|-----------|-------|-------------|
| `viewer` | 1 | Read-only access to all resources |
| `editor` | 2 | Can create and modify questionnaires and templates |
| `admin` | 3 | Full workspace control including member management |

### Action Permission Codes

API endpoints check permissions using standardized action codes:

| Action Code | Required Role | Endpoints |
|-------------|---------------|-----------|
| `questionnaires:read` | `viewer` | GET /api/questionnaires |
| `questionnaires:create` | `editor` | POST /api/questionnaires |
| `questionnaires:update` | `editor` | PUT /api/questionnaires/[id] |
| `questionnaires:delete` | `admin` | DELETE /api/questionnaires/[id] |
| `templates:read` | `viewer` | GET /api/templates |
| `templates:create` | `editor` | POST /api/templates |
| `templates:update` | `editor` | PUT /api/templates/[id] |
| `templates:delete` | `admin` | DELETE /api/templates/[id] |
| `workspace:update` | `admin` | PUT /api/workspaces/[id] |
| `workspace:billing` | `admin` | GET/POST /api/workspaces/[id]/billing |
| `workspace:members:invite` | `admin` | POST /api/workspaces/[id]/members |
| `workspace:members:remove` | `admin` | DELETE /api/workspaces/[id]/members/[id] |

### Authorization Response Codes

- `200`: Success
- `401`: Unauthorized (not authenticated)
- `403`: Forbidden (insufficient workspace permissions)
- `404`: Not found or not in workspace

## API Endpoints

### 1. Users API

#### Get All Users
```bash
curl -X GET http://localhost:3000/api/users
```

Response:
```json
{
  "success": true,
  "data": []
}
```

#### Create a User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "password": "securepassword123"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "temp-id",
    "email": "user@example.com",
    "name": "John Doe",
    "password_hash": "hashed",
    "created_at": "2025-11-04T03:00:00.000Z",
    "updated_at": "2025-11-04T03:00:00.000Z"
  }
}
```

### 2. Personas API

#### Get All Personas
```bash
curl -X GET "http://localhost:3000/api/personas?user_id=USER_ID"
```

#### Create a Persona
```bash
curl -X POST http://localhost:3000/api/personas \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-uuid",
    "name": "Marketing Manager",
    "description": "Target persona for marketing campaigns",
    "attributes": {
      "age_range": "25-45",
      "interests": ["technology", "business"]
    }
  }'
```

### 3. Templates API

#### Get All Templates
```bash
curl -X GET "http://localhost:3000/api/templates?persona_id=PERSONA_ID"
```

#### Create a Template
```bash
curl -X POST http://localhost:3000/api/templates \
  -H "Content-Type: application/json" \
  -d '{
    "persona_id": "persona-uuid",
    "name": "Customer Satisfaction Survey",
    "description": "Standard customer satisfaction questionnaire",
    "questions": [
      {
        "id": "q1",
        "text": "How satisfied are you with our service?",
        "type": "rating",
        "required": true,
        "order": 1
      },
      {
        "id": "q2",
        "text": "Would you recommend us to others?",
        "type": "boolean",
        "required": true,
        "order": 2
      }
    ]
  }'
```

### 4. Questionnaires API

#### Get All Questionnaires
```bash
curl -X GET "http://localhost:3000/api/questionnaires?template_id=TEMPLATE_ID&status=active"
```

#### Create a Questionnaire
```bash
curl -X POST http://localhost:3000/api/questionnaires \
  -H "Content-Type: application/json" \
  -d '{
    "template_id": "template-uuid",
    "title": "Q1 2025 Customer Survey",
    "description": "Quarterly customer satisfaction survey",
    "status": "active",
    "start_date": "2025-01-01T00:00:00Z",
    "end_date": "2025-03-31T23:59:59Z"
  }'
```

### 5. Respondents API

#### Get All Respondents
```bash
curl -X GET "http://localhost:3000/api/respondents?questionnaire_id=QUESTIONNAIRE_ID"
```

#### Create a Respondent
```bash
curl -X POST http://localhost:3000/api/respondents \
  -H "Content-Type: application/json" \
  -d '{
    "questionnaire_id": "questionnaire-uuid",
    "email": "respondent@example.com",
    "name": "Jane Smith",
    "metadata": {
      "source": "email_campaign",
      "device": "mobile"
    }
  }'
```

### 6. Answers API

#### Get All Answers
```bash
curl -X GET "http://localhost:3000/api/answers?respondent_id=RESPONDENT_ID"
```

#### Submit an Answer
```bash
curl -X POST http://localhost:3000/api/answers \
  -H "Content-Type: application/json" \
  -d '{
    "respondent_id": "respondent-uuid",
    "question_id": "q1",
    "value": 5
  }'
```

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

## Testing Workflow

Here's a complete workflow for testing the entire system:

```bash
# 1. Create a user
USER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"pass123"}')

# 2. Create a persona
PERSONA_RESPONSE=$(curl -s -X POST http://localhost:3000/api/personas \
  -H "Content-Type: application/json" \
  -d '{"user_id":"user-id","name":"Test Persona","description":"For testing"}')

# 3. Create a template
TEMPLATE_RESPONSE=$(curl -s -X POST http://localhost:3000/api/templates \
  -H "Content-Type: application/json" \
  -d '{"persona_id":"persona-id","name":"Test Template","questions":[]}')

# 4. Create a questionnaire
QUESTIONNAIRE_RESPONSE=$(curl -s -X POST http://localhost:3000/api/questionnaires \
  -H "Content-Type: application/json" \
  -d '{"template_id":"template-id","title":"Test Survey","status":"active"}')

# 5. Create a respondent
RESPONDENT_RESPONSE=$(curl -s -X POST http://localhost:3000/api/respondents \
  -H "Content-Type: application/json" \
  -d '{"questionnaire_id":"questionnaire-id","name":"Respondent"}')

# 6. Submit an answer
ANSWER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/answers \
  -H "Content-Type: application/json" \
  -d '{"respondent_id":"respondent-id","question_id":"q1","value":"answer"}')
```

## Next Steps

To fully integrate with a real database:

1. Set up a PostgreSQL database (local or cloud BaaS)
2. Update the `.env` file with database credentials
3. Run the schema: `psql -U user -d database -f database/schema.sql`
4. Install a PostgreSQL client library: `npm install pg`
5. Implement database queries in the API routes using the client library

## Notes

- All endpoints currently return mock data
- Database integration is ready to be implemented
- Authentication should be added before production use
- Rate limiting and validation should be implemented for production
