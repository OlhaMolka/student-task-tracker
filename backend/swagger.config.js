module.exports = {
    swaggerDefinition: {
      openapi: "3.0.0",
      info: {
        title: "Task Manager API",
        version: "1.0.0",
        description: "API documentation for Task Manager application",
      },
      servers: [
        {
          url: "http://localhost:5000",
          url: "http://coreos-vm.lan:5000",
          url: "https://tasks.profi-it.com.ua"
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
        schemas: {
          User: {
            type: "object",
            required: ["name", "email", "password"],
            properties: {
              id: {
                type: "string",
                description: "The user's unique ID",
                readOnly: true,
              },
              name: {
                type: "string",
                description: "The user's name",
              },
              email: {
                type: "string",
                description: "The user's email address",
              },
              password: {
                type: "string",
                description: "The user's password",
                writeOnly: true,
              },
              role: {
                type: "string",
                enum: ["student", "admin"],
                default: "student",
                description: "The user's role",
              },
            },
          },
          Task: {
            type: "object",
            required: ["title", "description", "deadline"],
            properties: {
              id: {
                type: "string",
                description: "The task's unique ID",
                readOnly: true,
              },
              title: {
                type: "string",
                description: "The task's title",
              },
              description: {
                type: "string",
                description: "The task's description",
              },
              deadline: {
                type: "string",
                format: "date",
                description: "The task's deadline",
              },
              createdBy: {
                type: "string",
                description: "The ID of the user who created the task",
              },
            },
          },
          TaskStatus: {
            type: "object",
            required: ["taskId", "studentId", "status"],
            properties: {
              taskId: {
                type: "string",
                description: "The ID of the task",
              },
              studentId: {
                type: "string",
                description: "The ID of the student",
              },
              status: {
                type: "string",
                enum: ["на перевірці", "виконано", "зараховано", "не виконано"],
                description: "The status of the task",
              },
            },
          },
          AuthToken: {
            type: "object",
            properties: {
              token: {
                type: "string",
                description: "JWT authentication token",
              },
            },
          },
        },
      },
      tags: [
        { name: "Authentication", description: "User authentication operations" },
        { name: "Tasks", description: "Operations related to tasks" },
        { name: "Task Status", description: "Operations related to task statuses" },
        { name: "Users", description: "Operations related to users (admin only)" },
      ],
      paths: {
        "/api/auth/register": {
          post: {
            summary: "Register a new user",
            tags: ["Authentication"],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["name", "email", "password"],
                    properties: {
                      name: {
                        type: "string",
                        description: "User's name",
                      },
                      email: {
                        type: "string",
                        format: "email",
                        description: "User's email",
                      },
                      password: {
                        type: "string",
                        minLength: 6,
                        description: "User's password",
                      },
                    },
                  },
                },
              },
            },
            responses: {
              201: {
                description: "Registration successful",
              },
              400: {
                description: "User already exists",
              },
              500: {
                description: "Server error",
              },
            },
          },
        },
        "/api/auth/login": {
          post: {
            summary: "Authenticate user and get JWT token",
            tags: ["Authentication"],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                      email: {
                        type: "string",
                        format: "email",
                        description: "User's email",
                      },
                      password: {
                        type: "string",
                        description: "User's password",
                      },
                    },
                  },
                },
              },
            },
            responses: {
              200: {
                description: "Authentication successful, returns JWT token",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/AuthToken",
                    },
                  },
                },
              },
              400: {
                description: "Invalid credentials",
              },
              500: {
                description: "Server error",
              },
            },
          },
        },
        "/api/tasks": {
          get: {
            summary: "Get all tasks",
            tags: ["Tasks"],
            responses: {
              200: {
                description: "A list of tasks.",
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Task",
                      },
                    },
                  },
                },
              },
              500: {
                description: "Server error",
              },
            },
          },
          post: {
            summary: "Create a new task",
            tags: ["Tasks"],
            security: [
              {
                bearerAuth: [],
              },
            ],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Task",
                  },
                },
              },
            },
            responses: {
              201: {
                description: "Task created successfully",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Task",
                    },
                  },
                },
              },
              500: {
                description: "Server error",
              },
            },
          },
        },
        "/api/tasks/{id}": {
          put: {
            summary: "Update a task (admin only)",
            tags: ["Tasks"],
            security: [
              {
                bearerAuth: [],
              },
            ],
            parameters: [
              {
                in: "path",
                name: "id",
                required: true,
                description: "ID of the task to update",
                schema: {
                  type: "string",
                },
              },
            ],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/Task",
                  },
                },
              },
            },
            responses: {
              200: {
                description: "Task updated successfully",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/Task",
                    },
                  },
                },
              },
              403: {
                description: "Forbidden - only admins can update tasks",
              },
              404: {
                description: "Task not found",
              },
              500: {
                description: "Server error",
              },
            },
          },
          delete: {
            summary: "Delete a task (admin only)",
            tags: ["Tasks"],
            security: [
              {
                bearerAuth: [],
              },
            ],
            parameters: [
              {
                in: "path",
                name: "id",
                required: true,
                description: "ID of the task to delete",
                schema: {
                  type: "string",
                },
              },
            ],
            responses: {
              200: {
                description: "Task deleted successfully",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        msg: {
                          type: "string",
                          description: "Success message",
                        },
                        task: {
                          $ref: "#/components/schemas/Task",
                        },
                      },
                    },
                  },
                },
              },
              403: {
                description: "Forbidden - only admins can delete tasks",
              },
              404: {
                description: "Task not found",
              },
              500: {
                description: "Server error",
              },
            },
          },
        },
        "/api/task-statuses": {
          post: {
            summary: "Update or create task status for a student",
            tags: ["Task Status"],
            security: [
              {
                bearerAuth: [],
              },
            ],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["taskId", "status"],
                    properties: {
                      taskId: {
                        type: "string",
                        description: "The ID of the task",
                      },
                      status: {
                        type: "string",
                        enum: ["на перевірці", "виконано", "зараховано", "не виконано"],
                        description: "The status of the task",
                      },
                    },
                  },
                },
              },
            },
            responses: {
              200: {
                description: "Task status updated successfully",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/TaskStatus",
                    },
                  },
                },
              },
              201: {
                description: "Task status created successfully",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/TaskStatus",
                    },
                  },
                },
              },
              400: {
                description: "Missing taskId or status",
              },
              500: {
                description: "Server error",
              },
            },
          },
        },
        "/api/users": {
          get: {
            summary: "Get all users (admin only)",
            tags: ["Users"],
            security: [
              {
                bearerAuth: [],
              },
            ],
            responses: {
              200: {
                description: "A list of users",
                content: {
                  "application/json": {
                    schema: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/User",
                      },
                    },
                  },
                },
              },
              403: {
                description: "Forbidden - only admins can access this route",
              },
              500: {
                description: "Server error",
              },
            },
          },
        },
        "/api/users/{id}": {
          put: {
            summary: "Update a user (admin only)",
            tags: ["Users"],
            security: [
              {
                bearerAuth: [],
              },
            ],
            parameters: [
              {
                in: "path",
                name: "id",
                required: true,
                description: "ID of the user to update",
                schema: {
                  type: "string",
                },
              },
            ],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      name: {
                        type: "string",
                        description: "User's name",
                      },
                      email: {
                        type: "string",
                        format: "email",
                        description: "User's email",
                      },
                      role: {
                        type: "string",
                        enum: ["student", "admin"],
                        description: "User's role",
                      },
                    },
                  },
                },
              },
            },
            responses: {
              200: {
                description: "User updated successfully",
                content: {
                  "application/json": {
                    schema: {
                      $ref: "#/components/schemas/User",
                    },
                  },
                },
              },
              403: {
                description: "Forbidden - only admins can access this route",
              },
              404: {
                description: "User not found",
              },
              500: {
                description: "Server error",
              },
            },
          },
          delete: {
            summary: "Delete a user (admin only)",
            tags: ["Users"],
            security: [
              {
                bearerAuth: [],
              },
            ],
            parameters: [
              {
                in: "path",
                name: "id",
                required: true,
                description: "ID of the user to delete",
                schema: {
                  type: "string",
                },
              },
            ],
            responses: {
              200: {
                description: "User deleted successfully",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        msg: {
                          type: "string",
                          description: "Success message",
                        },
                        user: {
                          $ref: "#/components/schemas/User",
                        },
                      },
                    },
                  },
                },
              },
              403: {
                description: "Forbidden - only admins can access this route",
              },
              404: {
                description: "User not found",
              },
              500: {
                description: "Server error",
              },
            },
          },
        },
      },
    },
    apis: ["./routes/*.js"], //Шлях до route-файлів
  };
  