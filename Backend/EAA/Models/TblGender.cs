using System;
using System.Collections.Generic;

namespace EAA.Models;

public partial class TblGender
{
    public int GenderId { get; set; }

    public string GenderName { get; set; } = null!;

    public virtual ICollection<TblEmployee> TblEmployees { get; set; } = new List<TblEmployee>();
}
