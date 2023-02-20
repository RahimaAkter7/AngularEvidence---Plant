import { NotifyService } from './../../services/notify.service';
import { Pot } from './../../models/pot';
import { EntryPot } from './../../models/entry-pot';
import { DataService } from './../../services/data.service';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-master-view',
  templateUrl: './master-view.component.html',
  styleUrls: ['./master-view.component.css']
})
export class MasterViewComponent {

  potList : Pot[] = [];
  entryList : EntryPot[] = [];

  constructor(
    private dataSvc : DataService,
    private notifySvc: NotifyService,
    private matDialog: MatDialog
  ){}

  ngOnInit(): void {

    this.dataSvc.getSpotList().subscribe(x => {
      this.potList = x;
    });
    this.dataSvc.getBookingEntries().subscribe(x => {
      this.entryList = x;
    });
  }

  getSpotName(id : any){
    let data = this.potList.find(x => x.potId == id);
    return data?data.potName : '';
  }
  OnDelete(item : EntryPot) : void {
    this.matDialog.open(ConfirmDialogComponent, {
          width: '450px',
          enterAnimationDuration: '500ms'
        }).afterClosed()
      .subscribe(result => {
        if (result) {
          if (item.plantId) {
            this.dataSvc.deleteBooking(item.plantId).subscribe(x => {
              this.entryList = this.entryList.filter(x => x.plantId != item.plantId);
              this.notifySvc.message('Item Deleted Successfully !!!', 'DISMISS');
            }, error => {
              this.notifySvc.message('An error occured while deleting !!!', 'DISMISS');
            });
          }
        }
      });
  }


}
