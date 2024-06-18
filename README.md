# User Task Management

This project involves developing a backend API using Express.js and MongoDB to manage tasks and subtasks for users. The API allows CRUD operations on tasks and subtasks and ensures soft deletion handling, where deleted tasks or subtasks are excluded from GET API responses but remain in the database.

## Features

- **User Record Separation**: Each user has a dedicated record in the database to store their tasks and subtasks.
- **Task and Subtask Storage**: All tasks and subtasks for a user are stored within the same user record.
- **Soft Deletion Handling**: Deleted records remain in the database and are excluded from GET responses without affecting CRUD operations.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Postman Collection](#postman-collection)

## Installation

```bash
# Clone the repository
git clone https://github.com/HarshitGupta150/User-Task-Management.git

# Navigate into the directory
cd User-Task-Management

# Install dependencies and dev-dependencies
npm install --include=dev
```

## Usage

```bash
# Create a .env file using .env.example for environment variables
PORT=your_port
MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret_key

# Start the development server
npm start
```

## Database Schema

- **User Collection**: Stores user information including name, email, password and an array of tasks.
- **Task Object**: Encapsulates details such as subject, deadline, status, and a deletion flag.
- **Subtask Object**: Each task contains an array of subtasks with attributes like subject, deadline, status, and a deletion flag.

## API Documentation

### Users API Endpoint
- **Registers a new user**
  - **Endpoint**: `/users`
  - **Method**: `POST`
  - **Description**: Registers a new user.
  - **Protected**: No

- **Authenticates a user**
  - **Endpoint**: `/users/auth`
  - **Method**: `POST`
  - **Description**: Authenticates a user and generates a JWT token upon successful authentication.
  - **Protected**: No

### Tasks API Endpoint
- **List Tasks and its associated Subtasks**
  - **Endpoint**: `/tasks`
  - **Method**: `GET`
  - **Description**: Retrieves all tasks and their associated subtasks for a user. Excludes tasks and subtasks marked as deleted.
  - **Protected**: Yes

- **Add a New Task**
  - **Endpoint**: `/tasks`
  - **Method**: `POST`
  - **Description**: Creates a new task with details such as subject, deadline, and status.
  - **Protected**: Yes

- **Edit a Task**
  - **Endpoint**: `/tasks/:taskId`
  - **Method**: `PUT`
  - **Description**: Updates the details of an existing task identified by `taskId`.
  - **Protected**: Yes

- **Delete a Task**
  - **Endpoint**: `/tasks/:taskId`
  - **Method**: `DELETE`
  - **Description**: Marks a task as deleted in the database.
  - **Protected**: Yes

- **List Subtasks for a Task**
  - **Endpoint**: `/tasks/:taskId/subtasks`
  - **Method**: `GET`
  - **Description**: Retrieves all non-deleted subtasks associated with a specific task.
  - **Protected**: Yes

- **Update Subtasks for a Task**
  - **Endpoint**: `/tasks/:taskId/subtasks`
  - **Method**: `PUT`
  - **Description**: Updates the list of subtasks for a task. The request body should contain the complete list of non-deleted subtasks.
  - **Protected**: Yes

## Postman Collection
- Import the postman collection (Task management.postman_collection.json) provided at root location in the project and use it to test the APIs.