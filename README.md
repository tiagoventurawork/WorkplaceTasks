WorkplaceTasks

API de tarefas com JWT + RBAC | .NET 8 + React + MySQL

   Backend (.NET 8)


cd TaskManager.API

  Ajusta appsettings.json com tua password MySQL
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=workplace_tasks;User=root;Password=root"
}

  Corre (migrations são automáticas)
dotnet run

  Swagger: http://localhost:5000/swagger


   Frontend (React + Vite)


cd frontend/task-manager-app

npm install
npm run dev

  App: http://localhost:5173


 

  RBAC

| Role | Criar | Editar | Apagar |

  Member  | Pode criar | edita só as suas | apaga só as suas |
  Manager  | Pode criar | edita todas | apaga só as suas |
  Admin  | Pode criar | edita todas | apaga todas | Só Admin gere users (`/api/users`)

 

   Endpoints Essenciais

   Auth

  Registar
POST /api/auth/register
{ "username": "ze", "email": "ze@test.com", "password": "Pass123!" }

  Login (retorna token JWT)
POST /api/auth/login
{ "email": "ze@test.com", "password": "Pass123!" }


   Tasks

  Listar
GET /api/tasks?status=0&searchTerm=bug

  Criar
POST /api/tasks
{ "title": "Fix", "description": "Bug", "status": 0 }

  Editar
PUT /api/tasks/{id}

  Apagar
DELETE /api/tasks/{id}


 Status:  0=Pending, 1=InProgress, 2=Completed

   Users (Admin Only)

GET /api/users            Listar
PUT /api/users/{id}/role  Mudar role
{ "role": 1 }             0=Member, 1=Manager, 2=Admin
DELETE /api/users/{id}    Apagar


 

 Testar no Swagger

1. `POST /register` → Cria user
2. Copia o `token` da resposta
3. SQL: `UPDATE Users SET Role = 2 WHERE Email = 'teu@email.com'`
4. Clica  "Authorize"  (cadeado verde)
5. Cola o token
6. Testa endpoints

 

  Arquitetura

 Backend: 

Request → Controller → Service (RBAC) → EF Core → MySQL


 Frontend: 

Component → Service (axios) → API → LocalStorage (token)


 JWT Token tem: 
- userId
- email
- role (Member/Manager/Admin)

 

 Frontend - Como Funciona

 Protected Routes: 

Qualquer user autenticado
<Route path="/tasks" element={<ProtectedRoute><TasksPage/></ProtectedRoute>} />

Só Admin
<Route path="/users" element={<ProtectedRoute requiredRole={Admin}><UsersPage/></ProtectedRoute>} />


 RBAC nos Botões: 

{canEditTask(task, user) && <button>Editar</button>}
{canDeleteTask(task, user) && <button>Apagar</button>}


Token Automático:
- Axios interceptor adiciona `Authorization: Bearer {token}` a todos os requests
- Se API retorna 401 → auto-logout



 Contas de Teste


-- Corre isto no MySQL
INSERT INTO Users (Id, Username, Email, PasswordHash, Role, CreatedAt, UpdatedAt)
VALUES (UUID(), 'admin', 'admin@test.com',
  '$2a$11$xK3qJ4Y.N7rZ8vP2fW9zOuHj3L6yT8mQ1kR5nA9wX7sB6cD4eE5fF',
  2, UTC_TIMESTAMP(), UTC_TIMESTAMP());


 Login:  admin@test.com / Admin123!

 

 Fixes Rápidos

 Backend não arranca: 

  MySQL a correr?
sudo service mysql start

  Connection string ok?
Verifica appsettings.json


 Frontend dá Network Error: 

  Backend a correr?
http://localhost:5000/swagger

  CORS config?
Já está ok para :3000 e :5173


 Token expirado: 

  Limpa e faz login de novo
localStorage.clear()




 Stack

 Backend:  .NET 8, EF Core, MySQL, JWT, BCrypt  
 Frontend:  React 19, TypeScript, Vite, Axios, React Router



 Estrutura


TaskManager.API/
 Controllers/     Endpoints
 Services/        Lógica + RBAC
 Models/          Entities, DTOs
 Data/            DbContext

frontend/task-manager-app/
 components/        UI
 pages/             Rotas
 services/          API calls
 context/           Auth state


 Stack:  .NET 8 + React 19 + MySQL  
 Auth:  JWT Stateless  
 RBAC:  3 níveis (Member, Manager, Admin)  
