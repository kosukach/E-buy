import { Component, OnInit } from '@angular/core';

import { RestApiService } from "../../services/rest-api.service";
import { DataService } from "../../services/data.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  name:string = "";
  email:string = "";
  password:string = "";
  confirmPassword:string = "";
  
  isSeller:boolean = false;
  btnDisabled:boolean = false;
  

  constructor(private router: Router, private data: DataService, private rest: RestApiService) { }

  ngOnInit(): void {
    
  }
  validate(): void{
    if(!this.name) throw {message: "Please Enter Your Name"}
    if(!this.email) throw {message: "Please Enter Your Email"}
    if(!this.password) throw {message: "Please Enter Your Password"}
    if(!this.confirmPassword) throw {message: "Please Enter Your Confirmation Password"}
    if(this.confirmPassword !== this.password) throw {message: "Passwords Don't Match"}
  }

  async register(){
    let body = {
      name: this.name,
      email: this.email,
      password: this.password,
      isSeller: this.isSeller
    }
    this.btnDisabled = true
    try{
      this.validate();
      let res = await this.rest.post("http://localhost:8080/api/accounts/singup", body);
      if(!res["success"]) throw res;
      localStorage.setItem("token", res["token"]);
      
      await this.data.getProfile()
      this.router.navigate(["profile/address"])
      .then(()=>{
        this.data.success("Registration successful. Please enter your address.")
      })
      .catch((error)=>{
        this.data.error(error["message"])
      })
    }
    catch(error){
      //May need to be fixed to an object which contains an error parameter.
      console.error(error);
      this.data.error(error.message);
    }
    this.btnDisabled = false;
  }
}
