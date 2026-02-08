using System.ComponentModel.DataAnnotations;
using TaskManager.API.Models.Enums;

namespace TaskManager.API.Models.DTOs
{
    // DTO CREATE task
    public class CreateTaskDto
    {
        [Required(ErrorMessage = "Title is required")]
        [StringLength(200, MinimumLength = 3, ErrorMessage = "Title must be between 3 and 200 characters")]
        public string Title { get; set; } = string.Empty;

        [StringLength(2000, ErrorMessage = "Description cannot exceed 2000 characters")]
        public string Description { get; set; } = string.Empty;

        public TaskItemStatus Status { get; set; } = TaskItemStatus.Pending;

        public Guid? AssignedToId { get; set; }
    }

    // DTO UPDATE task
    public class UpdateTaskDto
    {
        [Required(ErrorMessage = "Title is required")]
        [StringLength(200, MinimumLength = 3, ErrorMessage = "Title must be between 3 and 200 characters")]
        public string Title { get; set; } = string.Empty;

        [StringLength(2000, ErrorMessage = "Description cannot exceed 2000 characters")]
        public string Description { get; set; } = string.Empty;

        [Required]
        public TaskItemStatus Status { get; set; }

        public Guid? AssignedToId { get; set; }
    }

    // DTO update STATUS
    public class UpdateTaskStatusDto
    {
        [Required]
        public TaskItemStatus Status { get; set; }
    }

    // DTO RESPONSE
    public class TaskResponseDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public TaskItemStatus Status { get; set; }
        public string StatusName => Status.ToString();  // "Pending", "InProgress", "Done"
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public Guid CreatedById { get; set; }
        public string CreatedByUsername { get; set; } = string.Empty;
        public Guid? AssignedToId { get; set; }
        public string? AssignedToUsername { get; set; }
    }

    // Search
    public class TaskQueryParameters
    {
        private const int MaxPageSize = 50;
        private int _pageSize = 10;

        public int PageNumber { get; set; } = 1;

        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = value > MaxPageSize ? MaxPageSize : value;  // Limita a 50 máximo
        }

        public TaskItemStatus? Status { get; set; }  // Filtrar por status
        public string? SearchTerm { get; set; }      // Pesquisa por texto
        public Guid? AssignedToId { get; set; }      // Filtrar por assignee
        public Guid? CreatedById { get; set; }       // Filtrar por criador
    }

    // Paging response
    public class PaginatedResponse<T>
    {
        public IEnumerable<T> Items { get; set; } = new List<T>();
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
        public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
        public bool HasPreviousPage => PageNumber > 1;
        public bool HasNextPage => PageNumber < TotalPages;
    }
}