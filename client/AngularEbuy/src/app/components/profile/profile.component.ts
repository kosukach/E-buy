import { Component, OnInit } from '@angular/core';

import { DataService } from "../../services/data.service";
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(public data: DataService) { }

  ngOnInit(): void {
  }

}
