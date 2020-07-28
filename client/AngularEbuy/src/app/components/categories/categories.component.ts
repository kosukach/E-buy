import { Component, OnInit } from '@angular/core';

import { RestApiService } from "../../services/rest-api.service";
import { DataService } from "../../services/data.service";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  categories: any;

  newCategory: any;
  btnDisabled: boolean = false;

  constructor(private data: DataService, private rest: RestApiService) { }

  async ngOnInit() {
    try{
      const res = await this.rest.get("http://localhost:8080/api/categories");
      if(!res["success"]) throw res
      this.categories = res["categories"]
      
    }
    catch(error){
      this.data.error(error["message"])
    }
  }

  async addCategory(){
    this.btnDisabled = true;
    try{
      if(!this.newCategory) throw {message: "Enter category name"}
      const res = await this.rest.post("http://localhost:8080/api/categories", {name: this.newCategory});
      if(!res["success"]) throw res;
      this.data.success(res["message"]);
    } 
    catch(error){
      this.data.error(error["message"])
    }
    this.btnDisabled = false;
  }

}
