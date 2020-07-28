import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { DataService } from "../../services/data.service";
import { RestApiService } from "../../services/rest-api.service";
import { LocalImageService } from "../../services/local-image.service";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  
  categoryId: string;
  category: any;
  
  page:number = 1;
  perPage:number = 10;

  constructor(
    private data: DataService,
    private rest: RestApiService,
    private route: ActivatedRoute,
    public urlFix: LocalImageService
    ) { }

  async ngOnInit(){
    this.route.params.subscribe(res =>{
      this.categoryId = res["id"];
      this.getProducts();
    })
  }
  async getProducts(event ?:any){
    if(event){

    }
    try {
      const res = await this.rest.get(`http://localhost:8080/api/categories/${this.categoryId}?page=${this.page-1}`);
      if(!res["success"]) throw res;
      this.category = res;
      this.data.success(res["message"]);
    } catch (error) {
      this.data.error(error["message"]);
    }
    
  }

  get lower() :number{
    return (this.page - 1) * this.perPage;
  }
  get upper() :number{
    return Math.min(this.page * 10, this.category.totalProducts);
  }
}
