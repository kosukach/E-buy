import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from "@angular/common/http"

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  constructor(private http: HttpClient) { }

  getHeaders(){
    const token = localStorage.getItem("token");
    return token ? new HttpHeaders().set("Authorization", token): null;
  }

  get(url: string){
    return this.http.get(url, {headers: this.getHeaders()}).toPromise()
  }

  post(url: string, body: any){
    return this.http.post(url, body, {headers: this.getHeaders()}).toPromise()
  }

  
}
