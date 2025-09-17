using System;
using System.Collections.Generic;

namespace EAA.Domain.Models;

public partial class TblAppraisalCycle
{
    public int CycleId { get; set; }

    public string CycleName { get; set; } = null!;

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }

    public int? StatusId { get; set; }

    public DateTime? CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public int? CreatedBy { get; set; }

    public int? ModifiedBy { get; set; }

    public virtual TblEmployee? CreatedByNavigation { get; set; }

    public virtual TblEmployee? ModifiedByNavigation { get; set; }

    public virtual TblCycleStatus? Status { get; set; }

    public virtual ICollection<TblAppraisalResult> TblAppraisalResults { get; set; } = new List<TblAppraisalResult>();

    public virtual ICollection<TblAppraisal> TblAppraisals { get; set; } = new List<TblAppraisal>();

    public virtual ICollection<TblAssignedForm> TblAssignedForms { get; set; } = new List<TblAssignedForm>();

    public virtual ICollection<TblFeedback> TblFeedbacks { get; set; } = new List<TblFeedback>();
    public bool IsDeleted { get; set; }
}
