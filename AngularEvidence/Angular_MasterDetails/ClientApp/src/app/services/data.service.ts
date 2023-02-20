import { Plant } from './../models/plant';
import { EntryPot } from './../models/entry-pot';
import { Pot } from './../models/pot';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const apiUrl = "http://localhost:5117/api/";
@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private http : HttpClient) { }

  getSpotList() : Observable<Pot[]>{
    return this.http.get<Pot[]>(apiUrl + "StockEntries/GetPots");
  }

  postBooking(data : FormData) : Observable<EntryPot>{
    return this.http.post<EntryPot>(apiUrl + "StockEntries", data);
  }

  updateBooking(data : FormData) : Observable<EntryPot>{
    return this.http.post<EntryPot>(apiUrl + "StockEntries/Update", data);
  }

  deleteBooking(id : number) : Observable<EntryPot>{
    return this.http.post<EntryPot>(apiUrl + "StockEntries/Delete/"+id, null);
  }

  getClients() : Observable<Plant[]>{
    return this.http.get<Plant[]>(apiUrl + "StockEntries/GetClients");
  }

  getBookingEntries() : Observable<EntryPot[]>{
    return this.http.get<EntryPot[]>(apiUrl + "StockEntries");
  }

  getBookingEntryById(id : number): Observable<EntryPot> {
    return this.http.get<EntryPot>(apiUrl + "StockEntries/"+ id);
  }

}
