import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"

import { DataService } from "../../services/data.service";
import { RestApiService } from "../../services/rest-api.service"  
@Component({
  selector: 'app-post-product',
  templateUrl: './post-product.component.html',
  styleUrls: ['./post-product.component.scss']
})
export class PostProductComponent implements OnInit {

  product = {
    title: "",
    price: 0,
    category: "",
    description: "",
    product_picture: null,

  }

  categories: any;
  btnDisabled: boolean = false;

  constructor(private data: DataService, private rest: RestApiService, private router: Router) { }


  async ngOnInit() {
    try{
      const res = await this.rest.get("http://localhost:8080/api/categories");
      if(!res["success"]) throw res;

      this.categories = res["categories"];
    }
    catch (error){
      this.data.error(error["message"])

    }
  }

  validate(product) {
    if(!product.title) throw {message: "Enter product title"}
    if(!product.category) throw {message: "Select product category"}
    if(!product.price) throw {message: "Enter product price"}
    if(!product.description) throw {message: "Enter product desctiption"}
    if(!product.product_picture) throw {message: "Select product picture"}

  }

  fileChange(event:any){

    this.product.product_picture = event.target.files[0];
  }

  async post(){
    this.btnDisabled = true;
    
    try{
      this.validate(this.product);
      const form = new FormData();
      for(let prop in this.product){
        if(prop === "product_picture"){
          form.append(
            "product_picture",
            this.product.product_picture,
            this.product.product_picture.name
            )
            continue
          }
          form.append(prop, this.product[prop])
        }
        
        const res = await this.rest.post("http://localhost:8080/api/seller/products", form);
        if(!res["success"]) throw res;
        this.router.navigate(["/profile/myproducts"])
          .then(()=>this.data.success(res["message"]))
          .catch((error)=> this.data.error(error));
      }
      catch(error){
        this.data.error(error["message"])
      }
      
      this.btnDisabled = false;
    }
  }
