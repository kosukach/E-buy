import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

import { DataService } from "../../services/data.service";
import { RestApiService } from "../../services/rest-api.service";
import { LocalImageService } from "../../services/local-image.service";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  product: any;

  myReview = {
    title: "",
    description: "",
    rating: "",
    productId: null
  };
  btnDisabled:boolean = false;

  constructor(
    private data: DataService,
    private rest: RestApiService,
    private route: ActivatedRoute,
    private router: Router,
    public urlFix: LocalImageService
  ) { }

  async ngOnInit(){
    this.route.params.subscribe(res =>{
      
      this.getProduct(res["id"]);
    })
  }
  
  async getProduct(id){
    try {
      const res = await this.rest.get(`http://localhost:8080/api/product/${id}`);
      
      if(!res["success"]) this.router.navigate(["/"]);
      this.product = res["product"];
      this.data.success(res["message"]);
      
    } catch (error) {
      this.data.error(error["message"])
    }
  }

  async postReview(){
    this.btnDisabled = true;
    this.myReview.productId = this.product._id
    try{
      const res = await this.rest.post("http://localhost:8080/api/review", this.myReview);
      if(!res["success"]) throw res;
      this.data.success(res["message"]);
    }
    catch(error){
      this.data.error(error["message"]);
    }
    this.btnDisabled = false;
  }

  addToCart() {
    this.data.addToCart(this.product)
      ? this.data.success("Product successfully added to cart.")
      : this.data.error("Product already added to cart.")
  }
}


