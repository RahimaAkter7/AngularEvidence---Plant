import { Pot } from './../../models/pot';
import { DataService } from './../../services/data.service';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { EntryPot } from 'src/app/models/entry-pot';
import { DatePipe } from '@angular/common';
import { NotifyService } from 'src/app/services/notify.service';

@Component({
  selector: 'app-master-edit',
  templateUrl: './master-edit.component.html',
  styleUrls: ['./master-edit.component.css']
})
export class MasterEditComponent {
  potList: Pot[] = [];
  plantPicture: File = null!;
  entryPot : EntryPot = {plantId:undefined, plantName:undefined, quantity:undefined, picture:undefined, isstock:undefined}

  constructor(
    public dataSvc: DataService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private notifySvc : NotifyService
  ) { }

  bookingForm: FormGroup = new FormGroup({

    plantId: new FormControl(undefined, Validators.required),
    plantName: new FormControl(undefined, Validators.required),
    stockDate: new FormControl(undefined),
    quantity: new FormControl(undefined, Validators.required),
    isstock: new FormControl(undefined, Validators.required),
    potItems: new FormArray([])
  });

  get SpotItemsArray() {
    return this.bookingForm.controls["potItems"] as FormArray;
  }

  addSpotItem(item? : Pot) {
    if(item){
        this.SpotItemsArray.push(new FormGroup({
        potId: new FormControl(item.potId, Validators.required)
      }));
    }else{
        this.SpotItemsArray.push(new FormGroup({
        potId: new FormControl(undefined, Validators.required)
    }));
    }

  }

  removeSpotItem(index: number) {
    if (this.SpotItemsArray.controls.length > 0)
      this.SpotItemsArray.removeAt(index);
  }

  ngOnInit() {
    const id = this.activatedRouter.snapshot.params['id'];

    this.dataSvc.getBookingEntryById(id).subscribe(x => {
      this.entryPot = x;

      this.bookingForm.patchValue(this.entryPot);

      if (x.stockDate) {
        const stockDate = new Date(x.stockDate);
        const formattedStockDate =stockDate.toISOString().substring(0, 10);

        this.bookingForm.patchValue({
        stockDate: formattedStockDate
        });
      }

      this.entryPot.potsItems?.forEach(item =>{
                this.addSpotItem(item);
              });

    });

    this.dataSvc.getSpotList().subscribe((result) => {
      this.potList = result;
    });
  }

  onFileSelected(event: any) {
    this.plantPicture = event.target.files[0];
  }

  UpdateBooking() {

    var formData = new FormData();

    formData.append("potsStringify", JSON.stringify(this.bookingForm.get("potItems")?.value));
    formData.append("plantId", this.bookingForm.get("plantId")?.value);
    formData.append("plantName", this.bookingForm.get("plantName")?.value);
    formData.append("stockDate", this.bookingForm.get("stockDate")?.value);
    formData.append("quantity", this.bookingForm.get("quantity")?.value);
    formData.append("isstock", this.bookingForm.get("isstock")?.value);

    if (this.plantPicture) {
    formData.append("pictureFile", this.plantPicture, this.plantPicture.name);
    }

    this.dataSvc.updateBooking(formData).subscribe(
      {
        next: r => {
          console.log(r);
          this.router.navigate(['/masterdetails']);
          this.notifySvc.message('Data updated successfully !!!', 'DISMISS');
        },
        error: err => {
          console.log(err);
        }
      }
    );

  }
}
