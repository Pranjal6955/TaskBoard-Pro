#!/bin/bash

# Base URL for the API
BASE_URL="http://localhost:5000/api"

# JWT token for authentication (will be set after login)
TOKEN=""

# -----------------------------
# Authentication Routes
# -----------------------------

# Login with Firebase token (you'll get this token from the frontend after Google Auth)
echo "Logging in with Firebase token..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"idToken": "YOUR_FIREBASE_ID_TOKEN"}')

# Extract token from responsea
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | sed 's/"token":"//')

echo "Got token: $TOKEN"

# Get current user profile
echo -e "\nGetting current user profile..."
curl -s -X GET "$BASE_URL/auth/profile" \
  -H "Authorization: Bearer $TOKEN"

# -----------------------------
# Project Routes
# -----------------------------

# Get all projects for current user
echo -e "\nGetting all projects..."
curl -s -X GET "$BASE_URL/projects" \
  -H "Authorization: Bearer $TOKEN"

# Create a new project
echo -e "\nCreating new project..."
PROJECT_RESPONSE=$(curl -s -X POST "$BASE_URL/projects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "My Test Project",
    "description": "A project created via curl for testing purposes"
  }')

# Extract project ID from response
PROJECT_ID=$(echo $PROJECT_RESPONSE | grep -o '"_id":"[^"]*' | sed 's/"_id":"//')

echo "Created project with ID: $PROJECT_ID"

# Get specific project
echo -e "\nGetting specific project..."
curl -s -X GET "$BASE_URL/projects/$PROJECT_ID" \
  -H "Authorization: Bearer $TOKEN"

# Update a project
echo -e "\nUpdating project..."
curl -s -X PUT "$BASE_URL/projects/$PROJECT_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Updated Project Title",
    "description": "This description has been updated via curl",
    "statuses": ["To Do", "In Progress", "Testing", "Done"]
  }'

# Invite user to project
echo -e "\nInviting user to project..."
curl -s -X POST "$BASE_URL/projects/$PROJECT_ID/invite" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "email": "test@example.com",
    "role": "member"
  }'

# -----------------------------
# Task Routes
# -----------------------------

# Get all tasks for a project
echo -e "\nGetting all tasks for project..."
curl -s -X GET "$BASE_URL/tasks/project/$PROJECT_ID" \
  -H "Authorization: Bearer $TOKEN"

# Create a new task
echo -e "\nCreating new task..."
TASK_RESPONSE=$(curl -s -X POST "$BASE_URL/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Test Task",
    "description": "A task created via curl",
    "dueDate": "2023-12-31",
    "status": "To Do",
    "projectId": "'$PROJECT_ID'"
  }')

# Extract task ID from response
TASK_ID=$(echo $TASK_RESPONSE | grep -o '"_id":"[^"]*' | sed 's/"_id":"//')

echo "Created task with ID: $TASK_ID"

# Get specific task
echo -e "\nGetting specific task..."
curl -s -X GET "$BASE_URL/tasks/$TASK_ID" \
  -H "Authorization: Bearer $TOKEN"

# Update a task
echo -e "\nUpdating task..."
curl -s -X PUT "$BASE_URL/tasks/$TASK_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Updated Task",
    "status": "In Progress"
  }'

# Add a comment to a task
echo -e "\nAdding comment to task..."
curl -s -X POST "$BASE_URL/tasks/$TASK_ID/comments" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "text": "This is a test comment added via curl"
  }'

# -----------------------------
# Automation Routes
# -----------------------------

# Get all automations for a project
echo -e "\nGetting all automations for project..."
curl -s -X GET "$BASE_URL/automations/project/$PROJECT_ID" \
  -H "Authorization: Bearer $TOKEN"

# Create a new automation
echo -e "\nCreating new automation..."
AUTOMATION_RESPONSE=$(curl -s -X POST "$BASE_URL/automations" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "projectId": "'$PROJECT_ID'",
    "name": "Auto Move to In Progress",
    "triggerType": "task_assigned",
    "condition": {
      "field": "assignee",
      "operator": "not_equals",
      "value": null
    },
    "action": {
      "type": "change_status",
      "value": "In Progress"
    }
  }')

# Extract automation ID from response
AUTOMATION_ID=$(echo $AUTOMATION_RESPONSE | grep -o '"_id":"[^"]*' | sed 's/"_id":"//')

echo "Created automation with ID: $AUTOMATION_ID"

# -----------------------------
# Notification Routes
# -----------------------------

# Get all notifications for current user
echo -e "\nGetting all notifications..."
curl -s -X GET "$BASE_URL/notifications" \
  -H "Authorization: Bearer $TOKEN"

# Mark all notifications as read
echo -e "\nMarking all notifications as read..."
curl -s -X PUT "$BASE_URL/notifications/read-all" \
  -H "Authorization: Bearer $TOKEN"

# -----------------------------
# Cleanup (Optional)
# -----------------------------

echo -e "\nCleanup (Delete Task)..."
curl -s -X DELETE "$BASE_URL/tasks/$TASK_ID" \
  -H "Authorization: Bearer $TOKEN"

echo -e "\nCleanup (Delete Automation)..."
curl -s -X DELETE "$BASE_URL/automations/$AUTOMATION_ID" \
  -H "Authorization: Bearer $TOKEN"

echo -e "\nCleanup (Delete Project)..."
curl -s -X DELETE "$BASE_URL/projects/$PROJECT_ID" \
  -H "Authorization: Bearer $TOKEN"

echo -e "\nAll curl tests completed!"
