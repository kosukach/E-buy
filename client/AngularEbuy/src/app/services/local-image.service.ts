import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalImageService {

  constructor() { }

  correctSrc(e, image){
    if(e.currentTarget.src != `../../../assets/images/${image}`){
      e.preventDefault();
      e.currentTarget.src = `../../../assets/images/${image}`} 
  }
}
