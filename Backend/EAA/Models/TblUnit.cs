using System;
using System.Collections.Generic;

namespace EAA.Models;

public partial class TblUnit
{
    public int UnitId { get; set; }

    public string UnitName { get; set; } = null!;

    public DateTime? CreatedOn { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public int? CreatedBy { get; set; }

    public int? ModifiedBy { get; set; }

    public virtual ICollection<TblEmployee> TblEmployees { get; set; } = new List<TblEmployee>();
}
