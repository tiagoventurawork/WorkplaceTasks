using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskManager.API.Models.DTOs;
using TaskManager.API.Models.Enums;
using TaskManager.API.Services.Interfaces;

namespace TaskManager.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    [Produces("application/json")]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        // GET /api/tasks
        [HttpGet]
        [ProducesResponseType(typeof(PaginatedResponse<TaskResponseDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<PaginatedResponse<TaskResponseDto>>> GetTasks(
            [FromQuery] TaskQueryParameters parameters)
        {
            var userId = GetCurrentUserId();
            var userRole = GetCurrentUserRole();
            var tasks = await _taskService.GetTasksAsync(parameters, userId, userRole);
            return Ok(tasks);
        }

        // GET /api/tasks/{id}
        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(TaskResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<TaskResponseDto>> GetTask(Guid id)
        {
            var task = await _taskService.GetTaskByIdAsync(id);
            return Ok(task);
        }

        // POST /api/tasks
        [HttpPost]
        [ProducesResponseType(typeof(TaskResponseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<TaskResponseDto>> CreateTask([FromBody] CreateTaskDto dto)
        {
            var userId = GetCurrentUserId();
            var task = await _taskService.CreateTaskAsync(dto, userId);
            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
        }

        // PUT /api/tasks/{id}
        [HttpPut("{id:guid}")]
        [ProducesResponseType(typeof(TaskResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<TaskResponseDto>> UpdateTask(
            Guid id,
            [FromBody] UpdateTaskDto dto)
        {
            var userId = GetCurrentUserId();
            var userRole = GetCurrentUserRole();
            var task = await _taskService.UpdateTaskAsync(id, dto, userId, userRole);
            return Ok(task);
        }

        // PATCH /api/tasks/{id}/status
        [HttpPatch("{id:guid}/status")]
        [ProducesResponseType(typeof(TaskResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<TaskResponseDto>> UpdateTaskStatus(
            Guid id,
            [FromBody] UpdateTaskStatusDto dto)
        {
            var userId = GetCurrentUserId();
            var userRole = GetCurrentUserRole();
            var task = await _taskService.UpdateTaskStatusAsync(id, dto, userId, userRole);
            return Ok(task);
        }

        // DELETE /api/tasks/{id}
        [HttpDelete("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteTask(Guid id)
        {
            var userId = GetCurrentUserId();
            var userRole = GetCurrentUserRole();
            await _taskService.DeleteTaskAsync(id, userId, userRole);
            return NoContent();
        }

        // GET /api/tasks/{id}/can-edit
        [HttpGet("{id:guid}/can-edit")]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> CanEditTask(Guid id)
        {
            var userId = GetCurrentUserId();
            var userRole = GetCurrentUserRole();
            var canEdit = await _taskService.CanUserModifyTaskAsync(id, userId, userRole);
            return Ok(canEdit);
        }

        // GET /api/tasks/{id}/can-delete
        [HttpGet("{id:guid}/can-delete")]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> CanDeleteTask(Guid id)
        {
            var userId = GetCurrentUserId();
            var userRole = GetCurrentUserRole();
            var canDelete = await _taskService.CanUserDeleteTaskAsync(id, userId, userRole);
            return Ok(canDelete);
        }

        private Guid GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.Parse(userIdClaim!);
        }

        private UserRole GetCurrentUserRole()
        {
            var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
            return Enum.Parse<UserRole>(roleClaim!);
        }
    }
}