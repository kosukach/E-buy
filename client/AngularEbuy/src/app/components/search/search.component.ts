import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router"

import { DataService } from "../../services/data.service";
import { RestApiService } from "../../services/rest-api.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  query: string;
  page = 1;

  content: any

  constructor(private route: ActivatedRoute, private data: DataService, private rest: RestApiService) { }

  ngOnInit(): void {
    this.route.params.subscribe(res => {
      this.query = res["query"];
      this.page = 1;
      this.getProducts();
    })
  }

  async getProducts(){
    this.content = null;
    try {
      const res = await this.rest.get(
        `http://localhost:8080/api/search?query=${this.query}&page=${this.page - 1}`
      );
      if(!res["success"]) throw res;
      this.content = res["content"]
    } catch (error) {
      this.data.error(error["message"]);
    }


  }

  get lower() {
    return 1 + this.content.hitsPerPage * this.content.page;
  }

  get upper() {
    return Math.min(
      this.content.hitsPerPage * (this.content.page * 1),
      this.content.nbHits 
    )
  }
}
