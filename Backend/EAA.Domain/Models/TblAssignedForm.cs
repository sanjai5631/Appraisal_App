using System;
using System.Collections.Generic;

namespace EAA.Domain.Models;

public partial class TblAssignedForm
{
    public int AssignmentId { get; set; }

    public int? EmployeeId { get; set; }

    public int? CycleId { get; set; }

    public int? StatusId { get; set; }

    public DateTime? CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public int? CreatedBy { get; set; }

    public int? ModifiedBy { get; set; }

    public virtual TblEmployee? CreatedByNavigation { get; set; }

    public virtual TblAppraisalCycle? Cycle { get; set; }

    public virtual TblEmployee? Employee { get; set; }

    public virtual TblEmployee? ModifiedByNavigation { get; set; }

    public virtual TblCycleStatus? Status { get; set; }
}
