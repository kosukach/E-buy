import { Component, OnInit } from '@angular/core';

import { Router } from "@angular/router";
import { DataService } from "../../services/data.service";
import { RestApiService } from "../../services/rest-api.service"

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email: string = "";
  password: string = "";

  btnDisabled: boolean = false;

  constructor(private router: Router, private data: DataService, private rest: RestApiService) { }

  ngOnInit(): void {
  }


  validate(): void{
    if(!this.email) throw {message: "Enter Your Email"};
    if(!this.password) throw {message: "Enter Your Password"};
    
  }

  async login(){
    this.btnDisabled = true;
    try{
      this.validate()
      const body = {
        email: this.email,
        password: this.password
      }
      const res = await this.rest.post("http://localhost:8080/api/accounts/login", body);
      if(!res["success"]) throw res["error"];
      localStorage.setItem("token", res["token"]);
      await this.data.getProfile();
      this.data.success(res["message"]);
    }
    catch(error){
      console.error(error);
      this.data.error(error["message"]);
    }
    this.btnDisabled = false;
  }

}
