import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public region: any;

  constructor(private fb: FormBuilder, private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.getRegion();
  }


  //Check Region Availability
  public getRegion() {
    this.dashboardService.getRegion().subscribe({
      next: (response) => {
        console.log(response.body);
        if (response.body != null)
          if (response.body.length > 0) {
            this.region = response.body;
          } else {
            this.region = []
          }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

}
