import { Pot } from "./pot";

export class EntryPot {
  constructor(
      public plantId? : number,
      public plantName? : string,
      public stockDate? : Date,
      public quantity? : number,
      public picture? : string,
      public pictureFile? : File,
      public isstock? : boolean,
      public potsItems? : Pot[]
  ){}
}
