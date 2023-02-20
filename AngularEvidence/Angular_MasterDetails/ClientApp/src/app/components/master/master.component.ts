import { NotifyService } from './../../services/notify.service';
import { Pot } from './../../models/pot';
import { DataService } from './../../services/data.service';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.css']
})
export class MasterComponent {

  potList : Pot[] = [];
  plantPicture : File = null!;

  constructor(
    public dataSvc : DataService,
    private router : Router,
    private notifySvc : NotifyService
  ){}

  bookingForm : FormGroup = new FormGroup({
    plantId: new FormControl(undefined, Validators.required),
    plantName: new FormControl(undefined, Validators.required),
    stockDate: new FormControl(undefined),
    quantity: new FormControl(undefined, Validators.required),
    isstock: new FormControl(undefined, Validators.required),
    potItems: new FormArray([])
  });

  get PotItemsArray() {
    return this.bookingForm.controls["potItems"] as FormArray;
  }

  addSpotItem() {
    this.PotItemsArray.push(new FormGroup({
      potId: new FormControl(undefined, Validators.required)
    }));
  }

  removeSpotItem(index: number) {
    if (this.PotItemsArray.controls.length > 0)
      this.PotItemsArray.removeAt(index);
  }

  ngOnInit(){
    this.dataSvc.getSpotList().subscribe((result) => {
      this.potList = result;
    });
    this.addSpotItem();
  }

  onFileSelected(event : any){
    this.plantPicture = event.target.files[0];
  }

  CreateBooking(){

    var formData = new FormData();

    formData.append("potsStringify", JSON.stringify(this.bookingForm.get("potItems")?.value));
    formData.append("plantName", this.bookingForm.get("plantName")?.value);
    formData.append("stockDate", this.bookingForm.get("stockDate")?.value);
    formData.append("quantity", this.bookingForm.get("quantity")?.value);
    formData.append("isstock", this.bookingForm.get("isstock")?.value);
    formData.append("pictureFile", this.plantPicture, this.plantPicture.name);

    this.dataSvc.postBooking(formData).subscribe(
      {
        next : r => {
          console.log(r);
          this.router.navigate(['/masterdetails']);
          this.notifySvc.message('Data insered successfull!!!', 'DISMISS');
        },
        error : err => {
          console.log(err);
        }
      }
    );

  }

}
