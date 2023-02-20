using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Angular_MasterDetails.Models
{
    public class Plant
    {
        public int PlantId { get; set; }
        public string PlantName { get; set; }
        [Column(TypeName = "date")]
        public DateTime StockDate { get; set; }
        public int Quantity { get; set; }
        public string Picture { get; set; }
        public bool IsStock { get; set; }

        public virtual ICollection<StockEntry> StockEntries { get; set; } = new List<StockEntry>();

    }
    public class Pot
    {
        public int PotId { get; set; }
        public string? PotName { get; set; }
        public virtual ICollection<StockEntry> StockEntries { get; set; } = new List<StockEntry>();
    }
    public class StockEntry
    {
        public int StockEntryId { get; set; }
        [ForeignKey("Plant")]
        public int PlantId { get; set; }
        [ForeignKey("Pot")]
        public int PotId { get; set; }

        //Nav
        public virtual Plant Plant { get; set; }
        public virtual Pot Pot { get; set; }
    }
    public class PlantDbContext : DbContext
    {
        public PlantDbContext(DbContextOptions<PlantDbContext> options) : base(options) { }

        public DbSet<Plant> Plants { get; set; }
        public DbSet<Pot> Pots { get; set; }
        public DbSet<StockEntry> StockEntries { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Pot>().HasData
                (
                    new Pot { PotId = 1, PotName = "Plastic Pot" },
                    new Pot { PotId = 2, PotName = "Ceramic Pot" },
                    new Pot { PotId = 3, PotName = "No Pot" },
                    new Pot { PotId = 4, PotName = "Metal Pot" },
                    new Pot { PotId = 5, PotName = "Hanging Pot" }
                );
        }

        internal object Find(int plantId)
        {
            throw new NotImplementedException();
        }
    }
}
