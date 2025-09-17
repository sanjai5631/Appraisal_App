using System;
using System.Collections.Generic;

namespace EAA.Domain.Models;

public partial class TblCycleStatus
{
    public int StatusId { get; set; }

    public string StatusName { get; set; } = null!;

    public virtual ICollection<TblAppraisalCycle> TblAppraisalCycles { get; set; } = new List<TblAppraisalCycle>();

    public virtual ICollection<TblAssignedForm> TblAssignedForms { get; set; } = new List<TblAssignedForm>();
}
