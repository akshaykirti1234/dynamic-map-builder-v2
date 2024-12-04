import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UploadFileService } from '../../services/upload-file.service';
import { GroupService } from '../../services/group.service';
import { TableService } from '../../services/table.service';

@Component({
  selector: 'app-append',
  templateUrl: './append.component.html',
  styleUrls: ['./append.component.css']
})
export class AppendComponent {
  public appendForm: any;
  public layers: any;
  mode: string = "add";

  constructor(private fb: FormBuilder, private uploadFileService: UploadFileService, private groupService: GroupService, private tableService: TableService) { }

  ngOnInit(): void {
    this.appendForm = this.fb.group({
      group_id: ['', Validators.required],
      table_id: ['', Validators.required],
      zip_file: [null, Validators.required]
    });
    this.getAllGroups();
    this.getTables()
  }

  setMode(mode: string) {
    this.mode = mode;
    if (mode === 'view') {
      this.getTables();
    } else {
      this.getAllGroups();
      this.getTables();
    }
  }

  groups: any;
  // Fetch all groups for the dropdown
  public getAllGroups(): void {
    this.groupService.getAllGroups().subscribe({
      next: (response) => {
        this.groups = response.body.tgroups;
        console.log(this.groups);
      },
      error: (err) => {
        this.groups = [];
        console.log(err.error);
      }
    });
  }

  tables: any;
  onGroupChange(group_id: any) {
    if (group_id) {
      this.tableService.getTablesByGroupId(group_id.target.value).subscribe({
        next: (response) => {
          this.tables = response.body.tables;
          console.log(this.tables);
        },
        error: (error) => {
          this.layers = [];
          console.error(error);
        }
      })
    } else {
      this.tables = [];  // Clear the tables if no group is selected
    }
  }

  // Handle form submission for adding a new layer
  public onLayerSubmit() {
    if (this.appendForm.valid) {
      const formData = new FormData();

      const group_id = this.appendForm.get('group_id')?.value;
      const table_id = this.appendForm.get('table_id')?.value;
      const zip_file = this.appendForm.get('zip_file')?.value;

      console.log("Group ID:", group_id);
      console.log("Table Name:", table_id);
      console.log("Zip File:", zip_file);

      // Append the form controls to FormData
      formData.append('group_id', group_id);
      formData.append('table_id', table_id);
      formData.append('zip_file', zip_file);
      formData.forEach((key, value) => {
        console.log(key + "    " + value);
      })
      // Proceed with the API call
      this.tableService.appendTable(formData).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Success!',
            text: 'Saved Successfully',
            icon: 'success',
            confirmButtonText: 'OK',
          });
          this.appendForm.reset()
          this.ngOnInit();
        },
        error: (error) => {
          console.error(error);
          Swal.fire({
            title: 'Error!',
            text: error.error.detail,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      });
    }
  }


  onLayerFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (fileExtension === 'zip') {
        this.appendForm.patchValue({ zip_file: file });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Please upload a valid zip file'
        });
        event.target.value = '';
        this.appendForm.patchValue({ zip_file: null });
      }
    }
  }

  // Fetch the list of tables/layers
  public getTables(): void {
    this.tableService.getTables().subscribe({
      next: (response) => {
        this.layers = response.body.tlayers;
        console.log(this.layers);
      },
      error: (error) => {
        this.layers = [];
        console.error(error);
      }
    });
  }




  // onLayerFileSelected(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const fileExtension = file.name.split('.').pop()?.toLowerCase();
  //     if (fileExtension === 'zip') {
  //       this.ap.patchValue({ zip_file: file });
  //     } else {
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Please upload a valid zip file'
  //       });
  //       event.target.value = '';
  //       this.appendForm.patchValue({ zip_file: null });
  //     }
  //   }
  // }

  // public getLayers(): void {
  //   this.uploadFileService.getLayers().subscribe({
  //     next: (response) => {
  //       console.log(response.body);
  //       this.layers = response.body;
  //     },
  //     error: (error) => {
  //       this.layers = [];
  //       console.error(error);
  //     }
  //   });
  // }

  // public onLayerSubmit() {
  //   this.uploadFileService.saveLayer(this.layerForm.value).subscribe({
  //     next: (event) => {
  //       Swal.fire({
  //         title: 'Success!',
  //         text: 'Layer has been uploaded successfully.',
  //         icon: 'success',
  //         confirmButtonText: 'OK'
  //       });
  //       // Reset the form
  //       this.layerForm.reset();
  //     },
  //     error: (error) => {
  //       console.error(error);
  //       // Show SweetAlert2 error message
  //       Swal.fire({
  //         title: 'Error!',
  //         text: error.error,
  //         icon: 'error',
  //         confirmButtonText: 'OK'
  //       });
  //     }
  //   });

  // }


  publishLayer(layerId: Number) {

  }

  deleteLayer(layerId: Number) {
    Swal.fire({
      title: 'Delete Layer',
      text: "Do you want to delete?",
      icon: 'warning',
      // To show the second button
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.uploadFileService.deleteLayer(layerId, true).subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Done',
            })
            this.getTables();
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
