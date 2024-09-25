import { Component } from '@angular/core';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent {

  public mode: string = "add";
  public groupForm: any;

  setMode(mode: string) {
    this.mode = mode;
    if (mode === 'add') {
    } else {

    }
  }


}
