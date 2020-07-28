import { Component, OnInit } from '@angular/core';

import { DataService } from "../../services/data.service";
import { RestApiService } from "../../services/rest-api.service";

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

  btnDisabled: boolean = false;
  currentAddress: any;
  constructor(private data: DataService, private rest: RestApiService) { }

  async ngOnInit() {
    try{
      const res = await this.rest.get("http://localhost:8080/api/accounts/address")
      if(res["address"] === {}) this.data.warning("No shipping address specified");
      this.currentAddress = res["address"]
    }
    catch(error){
      this.data.error(error["message"]);
    }
  }

  async updateAddress() {
    this.btnDisabled = true;
    try{
      const res = await this.rest.post("http://localhost:8080/api/accounts/address", this.currentAddress)
      if(!res["success"]) throw res;
      this.data.getProfile();
      this.data.success(res["message"]);
    }
    catch(error){
      this.data.error(error["message"])
    }
    this.btnDisabled = false;
  }

}
