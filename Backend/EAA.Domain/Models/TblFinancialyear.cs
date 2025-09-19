using System;
using System.Collections.Generic;

namespace EAA.Domain.Models;

public partial class TblFinancialyear
{
    public int Financialyearid { get; set; }

    public string Yearname { get; set; } = null!;

    public int Startyear { get; set; }

    public int Endyear { get; set; }

    public virtual ICollection<TblAppraisalCycle> TblAppraisalCycles { get; set; } = new List<TblAppraisalCycle>();
}
