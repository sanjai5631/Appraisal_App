using System;
using System.Collections.Generic;

namespace EAA.Domain.Models;

public partial class TblQualification
{
    public int QualificationId { get; set; }

    public string QualificationName { get; set; } = null!;

    public virtual ICollection<TblEmployee> TblEmployees { get; set; } = new List<TblEmployee>();
}
