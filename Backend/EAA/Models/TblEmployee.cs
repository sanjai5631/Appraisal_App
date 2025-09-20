using System;
using System.Collections.Generic;

namespace EAA.Models;

public partial class TblEmployee
{
    public int EmployeeId { get; set; }

    public string EmpCode { get; set; } = null!;

    public string Name { get; set; } = null!;

    public int? GenderId { get; set; }

    public string? Religion { get; set; }

    public string? Phone { get; set; }

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public int? RoleId { get; set; }

    public int? QualificationId { get; set; }

    public DateOnly? Dob { get; set; }

    public DateTime? JoiningDate { get; set; }

    public DateTime? ExitDate { get; set; }

    public int? UnitId { get; set; }

    public bool? IsActive { get; set; }

    public bool? IsDeleted { get; set; }

    public DateTime? CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public int? CreatedBy { get; set; }

    public int? ModifiedBy { get; set; }

    public int? DeptId { get; set; }

    public virtual TblEmployee? CreatedByNavigation { get; set; }

    public virtual TblDepartment? Dept { get; set; }

    public virtual TblGender? Gender { get; set; }

    public virtual ICollection<TblEmployee> InverseCreatedByNavigation { get; set; } = new List<TblEmployee>();

    public virtual ICollection<TblEmployee> InverseModifiedByNavigation { get; set; } = new List<TblEmployee>();

    public virtual TblEmployee? ModifiedByNavigation { get; set; }

    public virtual TblQualification? Qualification { get; set; }

    public virtual TblRole? Role { get; set; }

    public virtual ICollection<TblAppraisal> TblAppraisalCreatedByNavigations { get; set; } = new List<TblAppraisal>();

    public virtual ICollection<TblAppraisalCycle> TblAppraisalCycleCreatedByNavigations { get; set; } = new List<TblAppraisalCycle>();

    public virtual ICollection<TblAppraisalCycle> TblAppraisalCycleModifiedByNavigations { get; set; } = new List<TblAppraisalCycle>();

    public virtual ICollection<TblAppraisal> TblAppraisalEmployees { get; set; } = new List<TblAppraisal>();

    public virtual ICollection<TblAppraisal> TblAppraisalModifiedByNavigations { get; set; } = new List<TblAppraisal>();

    public virtual ICollection<TblAppraisalResponse> TblAppraisalResponseCreatedByNavigations { get; set; } = new List<TblAppraisalResponse>();

    public virtual ICollection<TblAppraisalResponse> TblAppraisalResponseModifiedByNavigations { get; set; } = new List<TblAppraisalResponse>();

    public virtual ICollection<TblAppraisalResult> TblAppraisalResultCreatedByNavigations { get; set; } = new List<TblAppraisalResult>();

    public virtual ICollection<TblAppraisalResult> TblAppraisalResultEmployees { get; set; } = new List<TblAppraisalResult>();

    public virtual ICollection<TblAppraisalResult> TblAppraisalResultFinalizedByNavigations { get; set; } = new List<TblAppraisalResult>();

    public virtual ICollection<TblAppraisalResult> TblAppraisalResultModifiedByNavigations { get; set; } = new List<TblAppraisalResult>();

    public virtual ICollection<TblAppraisalTemplate> TblAppraisalTemplateCreatedByNavigations { get; set; } = new List<TblAppraisalTemplate>();

    public virtual ICollection<TblAppraisalTemplate> TblAppraisalTemplateModifiedByNavigations { get; set; } = new List<TblAppraisalTemplate>();

    public virtual ICollection<TblAssignedForm> TblAssignedFormCreatedByNavigations { get; set; } = new List<TblAssignedForm>();

    public virtual ICollection<TblAssignedForm> TblAssignedFormEmployees { get; set; } = new List<TblAssignedForm>();

    public virtual ICollection<TblAssignedForm> TblAssignedFormModifiedByNavigations { get; set; } = new List<TblAssignedForm>();

    public virtual ICollection<TblFeedback> TblFeedbackCreatedByNavigations { get; set; } = new List<TblFeedback>();

    public virtual ICollection<TblFeedback> TblFeedbackEmployees { get; set; } = new List<TblFeedback>();

    public virtual ICollection<TblFeedback> TblFeedbackModifiedByNavigations { get; set; } = new List<TblFeedback>();

    public virtual ICollection<TblFeedback> TblFeedbackReviewers { get; set; } = new List<TblFeedback>();

    public virtual ICollection<TblKpi> TblKpiCreatedByNavigations { get; set; } = new List<TblKpi>();

    public virtual ICollection<TblKpi> TblKpiModifiedByNavigations { get; set; } = new List<TblKpi>();

    public virtual ICollection<TblNotification> TblNotificationCreatedByNavigations { get; set; } = new List<TblNotification>();

    public virtual ICollection<TblNotification> TblNotificationEmployees { get; set; } = new List<TblNotification>();

    public virtual TblUnit? Unit { get; set; }
}
