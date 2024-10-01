import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GroupService } from '../../services/group.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})

export class GroupComponent implements OnInit {

  public mode: string = "add";
  public groupForm: any;
  public groups: any[] = [];


  constructor(private fb: FormBuilder, private groupService: GroupService) { }


  ngOnInit(): void {
    this.groupForm = this.fb.group({
      name: ['', Validators.required]
    })
  }

  setMode(mode: string) {
    this.mode = mode;
    if (mode === 'add') {
    } else {
      this.getAllGroups();
    }
  }


  public saveGroupForm() {
    if (this.groupForm.valid) {
      this.groupService.createGroup(this.groupForm.value).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Group created successfully'
          })
        },
        error: (err) => {
          console.log(err.error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: JSON.stringify(err.error.detail)
          })
        }
      })
    } else {
      alert("Please Enter Define a Group")
    }
  }

  public getAllGroups(): void {
    this.groupService.getAllGroups().subscribe({
      next: (response) => {
        this.groups = response.body.tgroups;
        console.log(this.groups);
      },
      error: (err) => {
        this.groups = []
        console.log(err.error);
      }
    })
  }

  public updateGroup(id: any) {

  }
  public deleteGroup(id: any) {

  }


}
