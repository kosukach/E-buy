import { Injectable } from '@angular/core';
import { NavigationStart, Router } from "@angular/router";


import { RestApiService } from "./rest-api.service"
import { JsonPipe } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  message: string = "";
  messageType: string = "danger";

  user: any;

  cartItems: number = 0;

  constructor(private router: Router, private rest: RestApiService) {
    this.router.events.subscribe(event => {
      if(event instanceof NavigationStart) {
        this.message = "";
      }
    })
  }

  error(message){
    this.messageType = "danger";
    this.message = message;
  }

  success(message){
    this.messageType = "success";
    this.message = message;
  }

  warning(message){
    this.messageType = "warning";
    this.message = message;
  }

  async getProfile(){
    try{
      let res = await this.rest.get("http://localhost:8080/api/accounts/profile");
      if(!res["success"]) throw res;
      this.user = res["user"];

    }
    catch(error){
      this.error(error["message"]);
    }
  }

  getCart() {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  }

  addToCart(item: string) {
    const cart: any = this.getCart();
    if(cart.find(data => JSON.stringify(data) === JSON.stringify(item))) {
      return false
    }
    cart.push(item);
    this.cartItems++;
    localStorage.setItem("cart", JSON.stringify(cart));
    return true;
  }

  clearCart() {
    this.cartItems = 0;
    localStorage.setItem("cart", '[]');

  }

  removeFromCart(item: string) {
    let cart: any = this.getCart();
    if(cart.find(product => JSON.stringify(product) === JSON.stringify(item))){
      cart = cart.filter(data => JSON.stringify(data) !== JSON.stringify(item));
      this.cartItems--;
      localStorage.setItem("cart", JSON.stringify(cart));

    }
  }

  

}
