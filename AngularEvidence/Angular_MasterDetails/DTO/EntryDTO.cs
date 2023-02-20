using Angular_MasterDetails.Models;
using Microsoft.AspNetCore.Mvc.ApplicationParts;
using System.ComponentModel.DataAnnotations;


namespace Angular_MasterDetails.DTO

{
    public class EntryDTO
    {
       public int PlantId { get; set; }

        public string PlantName { get; set; }

        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime StockDate { get; set; }

        public int Quantity { get; set; }

        public string Picture { get; set; }

        public IFormFile PictureFile { get; set; }

        public bool IsStock { get; set; }

        public string potsStringify { get; set; }

        public Pot[] PotsItems { get; set; }
    }
}
