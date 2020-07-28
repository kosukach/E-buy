import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from "@angular/common/http"
import { FormsModule }   from '@angular/forms';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HomeComponent } from './components/home/home.component';

import { RestApiService } from "./services/rest-api.service";
import { DataService } from "./services/data.service";
import { AuthGuardService } from "./services/auth-guard.service";
import { LocalImageService } from "./services/local-image.service";

import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { MessageComponent } from './components/message/message.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AddressComponent } from './components/address/address.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { PostProductComponent } from './components/post-product/post-product.component';
import { MyProductsComponent } from './components/my-products/my-products.component';
import { SafeHtmlPipePipe } from './pipes/safe-html-pipe.pipe';
import { CategoryComponent } from './components/category/category.component';
import { ProductComponent } from './components/product/product.component';
import { SearchComponent } from './components/search/search.component';
import { CartComponent } from './components/cart/cart.component'
@NgModule({
  declarations: [
    AppComponent, 
    HomeComponent,
    RegistrationComponent,
    LoginComponent,
    MessageComponent,
    ProfileComponent,
    SettingsComponent,
    AddressComponent,
    CategoriesComponent,
    PostProductComponent,
    MyProductsComponent,
    SafeHtmlPipePipe,
    CategoryComponent,
    ProductComponent,
    SearchComponent,
    CartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule
  ],
  providers: [RestApiService, DataService, AuthGuardService, LocalImageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
