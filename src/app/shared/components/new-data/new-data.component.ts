import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UploadFileService } from '../../services/upload-file.service';
import { GroupService } from '../../services/group.service';
import { TableService } from '../../services/table.service';

@Component({
  selector: 'app-new-data',
  templateUrl: './new-data.component.html',
  styleUrls: ['./new-data.component.css']
})
export class NewDataComponent {
  public tableForm: any;
  public layers: any;
  public groups: any[] = [];
  mode: string = "add";

  constructor(private fb: FormBuilder,
    private tableService: TableService,
    private uploadFileService: UploadFileService,
    private groupService: GroupService) { }

  ngOnInit(): void {
    this.tableForm = this.fb.group({
      group_id: ['', Validators.required],
      tableName: ['', Validators.required],
      shapeFile: [null, Validators.required]
    });
    this.getAllGroups();
  }

  setMode(mode: string) {
    this.mode = mode;
    if (mode === 'add') {
    } else {
      this.getTables();
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


  onLayerFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop()?.toLowerCase();

      if (fileExtension === 'zip') {
        this.tableForm.patchValue({
          shapeFile: file
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Please upload a valid zip file'
        })
        event.target.value = '';
        this.tableForm.patchValue({
          shapeFile: null
        });
      }
    }
  }

  public getTables(): void {
    this.tableService.getTables().subscribe({
      next: (response) => {
        console.log(response.body);
        this.layers = response.body.tlayers;
        console.log(this.layers);
      },
      error: (error) => {
        this.layers = [];
        console.error(error);
      }
    });
  }

  public onLayerSubmit() {
    if (this.tableForm.valid) {

      this.tableService.createTable(this.tableForm.value).subscribe({
        next: (event) => {
          Swal.fire({
            title: 'Success!',
            text: 'Layer has been uploaded successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          // Reset the form
          this.tableForm.reset();
        },
        error: (error) => {
          console.error(error);
          // Show SweetAlert2 error message
          Swal.fire({
            title: 'Error!',
            text: error.error.message,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    }
  }


  publishLayer(layerId: Number) {

  }

  deleteLayer(layerId: Number) {
    Swal.fire({
      title: 'Delete Layer',
      text: "Do you want to perform a soft delete or hard delete?",
      icon: 'warning',
      showCancelButton: true,
      showDenyButton: true,  // To show the second button
      confirmButtonText: 'Soft Delete',
      denyButtonText: 'Hard Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.uploadFileService.deleteLayer(layerId, false).subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Done',
            })
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
            })
          }
        });
      } else if (result.isDenied) {
        this.uploadFileService.deleteLayer(layerId, true).subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Done',
            })
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
            })
          }
        });
      }
    });
  }
}
