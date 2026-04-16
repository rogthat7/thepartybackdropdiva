using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace thepartybackdropdiva.Domain.Entities;

public class Advisor : BaseEntity
{
    [Required]
    public Guid UserId { get; set; }

    [ForeignKey("UserId")]
    public ApplicationUser User { get; set; } = null!;

    public string? Specialization { get; set; }
    
    public bool IsActive { get; set; } = true;

    // Navigation property for assignments
    public ICollection<AdvisorActiveConsultation> ActiveConsultations { get; set; } = new List<AdvisorActiveConsultation>();
}
