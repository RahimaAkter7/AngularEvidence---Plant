using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Angular_MasterDetails.Models;
using Angular_MasterDetails.DTO;
using Newtonsoft.Json;
using Angular_MasterDetails.Migrations;

namespace Angular_MasterDetails.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StockEntriesController : ControllerBase
    {
        private readonly PlantDbContext _context;
        private readonly IWebHostEnvironment _env;

        public StockEntriesController(PlantDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            this._env = env;
        }

        [HttpGet]
        [Route("GetPots")]
        public async Task<ActionResult<IEnumerable<Pot>>> GetPots()
        {
            return await _context.Pots.ToListAsync();
        }

        [HttpGet]
        [Route("GetPlants")]
        public async Task<ActionResult<IEnumerable<Plant>>> GetPlants()
        {
            return await _context.Plants.ToListAsync();
        }


        // GET: api/PlantEntries
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EntryDTO>>> GetStockEntries()
        {
            List<EntryDTO> entryPots = new List<EntryDTO>();

            var allPlants = _context.Plants.ToList();
            foreach (var plant in allPlants)
            {
                var potlist = _context.StockEntries.Where(x => x.PlantId == plant.PlantId).Select(x => new Pot { PotId = x.PotId }).ToList();
                entryPots.Add(new EntryDTO
                {
                    PlantId = plant.PlantId,
                    PlantName = plant.PlantName,
                    StockDate = plant.StockDate,
                    Quantity = plant.Quantity,
                    IsStock = plant.IsStock,
                    Picture = plant.Picture,
                    PotsItems = potlist.ToArray()
                });
            }


            return entryPots;
        }

        // GET: api/StockEntries
        [HttpGet("{id}")]
        public async Task<ActionResult<EntryDTO>> GetStockEntries(int id)
        {
            Plant plant = await _context.Plants.FindAsync(id);
            Pot[] potList = _context.StockEntries.Where(x => x.PlantId == plant.PlantId).Select(x => new Pot { PotId = x.PotId }).ToArray();

            EntryDTO entryPot = new EntryDTO()
            {
                PlantId = plant.PlantId,
                PlantName = plant.PlantName,
                StockDate = plant.StockDate,
                Quantity = plant.Quantity,
                IsStock = plant.IsStock,
                Picture = plant.Picture,
                PotsItems = potList
            };

            return entryPot;
        }


        // POST: api/StockEntries
        [HttpPost]
        public async Task<ActionResult<StockEntry>> PostStockEntry([FromForm] EntryDTO entryDTO)
        {

            var potItems = JsonConvert.DeserializeObject<Pot[]>(entryDTO.potsStringify);

            Plant plant = new Plant
            {
                PlantName = entryDTO.PlantName,
                StockDate = entryDTO.StockDate,
                Quantity = entryDTO.Quantity,
                IsStock = entryDTO.IsStock
            };

            if (entryDTO.PictureFile != null)
            {
                var webroot = _env.WebRootPath;
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(entryDTO.PictureFile.FileName);
                var filePath = Path.Combine(webroot, "Images", fileName);

                FileStream fileStream = new FileStream(filePath, FileMode.Create);
                await entryDTO.PictureFile.CopyToAsync(fileStream);
                await fileStream.FlushAsync();
                fileStream.Close();
                plant.Picture = fileName;
            }

            foreach (var item in potItems)
            {
                var stockEntry = new StockEntry
                {
                    Plant = plant,
                    PlantId = plant.PlantId,
                    PotId = item.PotId
                };
                _context.Add(stockEntry);
            }

            await _context.SaveChangesAsync();

            return Ok(plant);
        }

        //Update Booking
        // POST: api/StockEntries/Update
        [Route("Update")]
        [HttpPost]
        public async Task<ActionResult<StockEntry>> UpdateStockEntry([FromForm] EntryDTO entryDTO)
        {

            var potItems = JsonConvert.DeserializeObject<Pot[]>(entryDTO.potsStringify);

            Plant plant = _context.Plants.Find(entryDTO.PlantId);
            plant.PlantName = entryDTO.PlantName;
            plant.StockDate = entryDTO.StockDate;
            plant.Quantity = entryDTO.Quantity;
            plant.IsStock = entryDTO.IsStock;


            if (entryDTO.PictureFile != null)
            {
                var webroot = _env.WebRootPath;
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(entryDTO.PictureFile.FileName);
                var filePath = Path.Combine(webroot, "Images", fileName);

                FileStream fileStream = new FileStream(filePath, FileMode.Create);
                await entryDTO.PictureFile.CopyToAsync(fileStream);
                await fileStream.FlushAsync();
                fileStream.Close();
                plant.Picture = fileName;
            }

            //Delete existing spots
            var existingPots = _context.StockEntries.Where(x => x.PlantId == plant.PlantId).ToList();
            foreach (var item in existingPots)
            {
                _context.StockEntries.Remove(item);
            }

            //Add newly added spots
            foreach (var item in potItems)
            {
                var stockEntry = new StockEntry
                {
                    PlantId = plant.PlantId,
                    PotId = item.PotId
                };
                _context.Add(stockEntry);
            }

            _context.Entry(plant).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return Ok(plant);
        }


        //Delete Booking
        // POST: api/StockEntries/Update
        [Route("Delete/{id}")]
        [HttpPost]
        public async Task<ActionResult<StockEntry>> DeleteStockEntry(int id)
        {

            Plant plant = _context.Plants.Find(id);

            var existingPots = _context.StockEntries.Where(x => x.PlantId == plant.PlantId).ToList();
            foreach (var item in existingPots)
            {
                _context.StockEntries.Remove(item);
            }
      
            _context.Entry(plant).State = EntityState.Deleted;

            await _context.SaveChangesAsync();

            return Ok(plant);
        }


    }
}
