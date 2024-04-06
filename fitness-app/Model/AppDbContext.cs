using Microsoft.EntityFrameworkCore;
using System;

namespace EntityFrameworkCore.MySQL.Data
{
	public class AppDbContext : DbContext
	{
		public AppDbContext(DbContextOptions options) : base(options) { }
		public DbSet<User> Users { get; set; }
	}
}
