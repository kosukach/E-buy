import { Component, OnInit } from '@angular/core';

import { DataService } from "../../services/data.service";
import { RestApiService } from "../../services/rest-api.service";
import { LocalImageService } from "../../services/local-image.service"

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  products: any;

  constructor(private data: DataService, private rest: RestApiService, public urlFix: LocalImageService) { }

  async ngOnInit() {
    try {
      const res = await this.rest.get("http://localhost:8080/api/products")
      if(!res["success"]) throw res;
      this.products = res["products"];
    } catch (error) {
      this.data.error(error["message"])
    }
  }



}
