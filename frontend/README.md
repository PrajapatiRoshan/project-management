## 🔗 API Endpoints

Below is a comprehensive list of backend API endpoints grouped by functionality, along with example URLs.

### 🔐 Authentication

- **Login**  
  `POST /auth/login`  
  Example: `http://localhost:8000/auth/login`

- **Register**  
  `POST /auth/register`  
  Example: `http://localhost:8000/auth/register`

- **Logout**  
  `POST /auth/logout`  
  Example: `http://localhost:8000/auth/logout`

- **Get Current User**  
  `GET /user/current`  
  Example: `http://localhost:8000/user/current`

---

### 🏢 Workspaces

- **Create Workspace**  
  `POST /workspace/create/new`  
  Example: `http://localhost:8000/workspace/create/new`

- **Edit Workspace**  
  `PUT /workspace/update/{workspaceId}`  
  Example: `http://localhost:8000/workspace/update/12345`

- **Get Workspace by ID**  
  `GET /workspace/{workspaceId}`  
  Example: `http://localhost:8000/workspace/12345`

- **Get All Workspaces for User**  
  `GET /workspace/all`  
  Example: `http://localhost:8000/workspace/all`

- **Get Members in Workspace**  
  `GET /workspace/members/{workspaceId}`  
  Example: `http://localhost:8000/workspace/members/12345`

- **Get Workspace Analytics**  
  `GET /workspace/analytics/{workspaceId}`  
  Example: `http://localhost:8000/workspace/analytics/12345`

- **Change Member Role in Workspace**  
  `PUT /workspace/change/member/role/{workspaceId}`  
  Example: `http://localhost:8000/workspace/change/member/role/12345`

- **Delete Workspace**  
  `DELETE /workspace/delete/{workspaceId}`  
  Example: `http://localhost:8000/workspace/delete/12345`

---

### 👥 Members

- **Join Workspace via Invite Code**  
  `POST /member/workspace/{inviteCode}/join`  
  Example: `http://localhost:8000/member/workspace/abc123/join`

---

### 📊 Projects

- **Create Project**  
  `POST /project/workspace/{workspaceId}/create`  
  Example: `http://localhost:8000/project/workspace/12345/create`

- **Edit Project**  
  `PUT /project/{projectId}/workspace/{workspaceId}/update`  
  Example: `http://localhost:8000/project/67890/workspace/12345/update`

- **Get All Projects in Workspace**  
  `GET /project/workspace/{workspaceId}/all?pageSize={pageSize}&pageNumber={pageNumber}`  
  Example: `http://localhost:8000/project/workspace/12345/all?pageSize=10&pageNumber=1`

- **Get Project by ID**  
  `GET /project/{projectId}/workspace/{workspaceId}`  
  Example: `http://localhost:8000/project/67890/workspace/12345`

- **Get Project Analytics**  
  `GET /project/{projectId}/workspace/{workspaceId}/analytics`  
  Example: `http://localhost:8000/project/67890/workspace/12345/analytics`

- **Delete Project**  
  `DELETE /project/{projectId}/workspace/{workspaceId}/delete`  
  Example: `http://localhost:8000/project/67890/workspace/12345/delete`

---

### ✅ Tasks

- **Create Task**  
  `POST /task/projects/{projectId}/workspace/{workspaceId}/create`  
  Example: `http://localhost:8000/task/projects/67890/workspace/12345/create`

- **Get Task by ID**  
  `GET /task/{taskId}/project/{projectId}/workspace/{workspaceId}`  
  Example: `http://localhost:8000/task/11111/project/67890/workspace/12345`

- **Edit Task**  
  `PUT /task/{taskId}/projects/{projectId}/workspace/{workspaceId}/update`  
  Example: `http://localhost:8000/task/11111/projects/67890/workspace/12345/update`

- **Get All Tasks**  
  `GET /task/workspace/{workspaceId}/all?keyword={keyword}&assignedTo={assignedTo}&priority={priority}&status={status}&dueDate={dueDate}&pageNumber={pageNumber}&pageSize={pageSize}`  
  Example: `http://localhost:8000/task/workspace/12345/all?pageNumber=1&pageSize=10`

- **Delete Task**  
  `DELETE /task/{taskId}/workspace/{workspaceId}/delete`  
  Example: `http://localhost:8000/task/11111/workspace/12345/delete`

---

This section provides a clear overview of all backend API endpoints, making it easier for developers to integrate and test the application.
