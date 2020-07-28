import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { DataService } from "./services/data.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  isCollapsed:boolean = true;
  searchTerm:string = "";
  title:string = 'AngularEbuy';

  constructor(private router: Router, public data: DataService) {
  }
  ngOnInit(){
    this.data.getProfile();
    this.data.cartItems = this.data.getCart().length
  }
  get token() {
    return localStorage.getItem("token")
  }

  collapse(){
    this.isCollapsed = true;
  }

  closerDropdown(dropdown){
    dropdown.close()
  }

  logout(){
    localStorage.clear();
    this.data.cartItems = 0;
    this.router.navigate([""]);
    this.data.user = {};
  }

  search(){
    if(this.searchTerm){
      this.collapse();
      this.router.navigate([`search`, {query: this.searchTerm}])
    }
  }
}
