import { Component, OnInit } from '@angular/core';

import { RestApiService } from "../../services/rest-api.service";
import { DataService } from "../../services/data.service";
import { LocalImageService } from "../../services/local-image.service";

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.scss']
})
export class MyProductsComponent implements OnInit {
  
  products: any;

  
  constructor(private data: DataService, private rest: RestApiService, private urlFix: LocalImageService) { }
  
  async ngOnInit() {
    try{
      let res = await this.rest.get("http://localhost:8080/api/seller/products")
      if(!res["success"]) throw res;
      this.products = res["products"]
      
    }
    catch(error){
      this.data.error(error["message"])
    }
  }
  
}
