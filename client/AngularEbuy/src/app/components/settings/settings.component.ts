import { Component, OnInit } from '@angular/core';

import { DataService } from "../../services/data.service";
import { RestApiService } from "../../services/rest-api.service";
import { BuiltinType } from '@angular/compiler';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  
  btnDisabled: boolean = false;
  currentSettings: any;

  constructor(private data: DataService, private rest: RestApiService) { }

  async ngOnInit() {
    try{
      if(!this.data.user){
        await this.data.getProfile();
      }

      this.currentSettings = Object.assign({
        newPwd: "",
        confirmPwd: ""

      }, this.data.user)
    }
    catch(error){
      this.data.error(error["message"])
    }
  }


  validate(settings): void{
    if(!settings["name"]) throw {message: "Enter your name"}
    if(!settings["email"]) throw {message: "Enter your email"}
    
    if(settings["newPwd"] && !settings["confirmPwd"]) throw {message: "Enter your password confirmation"}
    if(settings["newPwd"] !== settings["confirmPwd"]) throw {message: "Passwords do not match"}

  }

  async update(settings) {
    this.btnDisabled = true;
    try{
      this.validate(this.currentSettings);
      let body = {
        name: this.currentSettings["name"],
        password: this.currentSettings["newPwd"],
        email: this.currentSettings["email"],
        isSeller: this.currentSettings["isSeller"]
      }
      
      const res = await this.rest.post("http://localhost:8080/api/accounts/profile", body);
      if(!res["success"]) throw res;
      await this.data.getProfile();
      this.data.success(res["message"])
      
    }
    catch(error){
      this.data.error(error["message"])
    }
    this.btnDisabled = false;
  }
}
