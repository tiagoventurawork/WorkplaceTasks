using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TaskManager.API.Models.Enums;

namespace TaskManager.API.Models.Entities
{
    public class TaskItem
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(2000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        public TaskItemStatus Status { get; set; } = TaskItemStatus.Pending;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Foreign Keys
        [Required]
        public Guid CreatedById { get; set; }

        public Guid? AssignedToId { get; set; }

        // Navigation Properties
        [ForeignKey("CreatedById")]
        public User CreatedBy { get; set; } = null!;

        [ForeignKey("AssignedToId")]
        public User? AssignedTo { get; set; }
    }
}