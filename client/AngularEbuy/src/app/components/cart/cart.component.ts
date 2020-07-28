import { Component, OnInit } from '@angular/core';

import { environment } from "../../../environments/environment";
import { DataService } from "../../services/data.service";
import { RestApiService } from "../../services/rest-api.service";
import { Router } from "@angular/router";

declare var StripeCheckout;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  btnDisabled = false;
  handler: any

  quantities = [];

  constructor(
    private data: DataService,
    private rest: RestApiService,
    private router: Router
  ) { }

  
  trackByCartItems(index: number, item: any) {
    return item._id;
  }
  
  get cartItems(){
    return this.data.getCart();
  }
  
  get cartTotal() {
    let total = 0;
    this.cartItems.forEach((item, index) => {
      total += item["price"] * this.quantities[index];
    });
    
    return total;
  }
  
  removeProduct(index, product) {
    this.quantities.splice(index, 1);
    this.data.removeFromCart(product)
  }

  async ngOnInit() {
    this.cartItems.forEach(item => {
      this.quantities.push(1);
    });
    this.handler = StripeCheckout.configure({
      key: environment.stripeKey,
      image: "../../../assets/images/fxxj3ttftm5ltcqnto1o4baovyl.png",
      locale: "auto",
      token: async stripeToken => {
        let products = [];
        this.cartItems.forEach((d, index)=> {
          products.push({
            product: d["_id"],
            quantity: this.quantities[index]
          })
        });

        try{
          const res = await this.rest.post(
            "http://localhost:8080/api/payment",
            {
              totalPrice: this.cartTotal,
              products,
              stripeToken
            }
          );
          
          res["success"]
            ? (this.data.clearCart(), this.data.success("Purchase Successful."))
            : this.data.error(res["message"])
        }
        catch(error){
          this.data.error(error)
        }
      }
    })
  }

  validate() {
    if(!this.quantities.every(item => item >0)){
      return this.data.warning("Quantities cannot be less than one.")
    }
    if(!localStorage.getItem("token")) {
      this.router.navigate(["/login"])
        .then(()=>{this.data.warning("You need to login before making a purchase")});
      return
    }
    if(!this.data.user["address"]) {
      this.router.navigate(["/profile/address"])
        .then(()=> {this.data.warning("You need to provide an address")});
      return
    }
    this.data.message = "";
    return true
  }

  async checkout(e){
    e.preventDefault()
    this.btnDisabled = true;
    try {
      if (this.validate()) {
        this.handler.open({
          name: "E-buy",
          description: "Checkout Payment",
          amount: this.cartTotal * 100,
          closed: () => {
            this.btnDisabled = false
          }
        });
      }else {
        this.btnDisabled = false;
      }
    }
    catch(error){
      this.data.error(error);
    }
  }
}
