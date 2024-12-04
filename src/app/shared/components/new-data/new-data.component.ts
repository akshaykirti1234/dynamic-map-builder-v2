import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UploadFileService } from '../../services/upload-file.service';
import { GroupService } from '../../services/group.service';
import { TableService } from '../../services/table.service';
import { loadFeaturesXhr } from 'ol/featureloader';

@Component({
  selector: 'app-new-data',
  templateUrl: './new-data.component.html',
  styleUrls: ['./new-data.component.css']
})
export class NewDataComponent implements OnInit {
  public tableForm: any;
  public layers: any;
  public groups: any[] = [];
  mode: string = "add";

  constructor(
    private fb: FormBuilder,
    private tableService: TableService,
    private uploadFileService: UploadFileService,
    private groupService: GroupService
  ) { }

  ngOnInit(): void {
    // Initialize form group with the correct control names
    this.tableForm = this.fb.group({
      group_id: ['', Validators.required],
      table_name: ['', Validators.required],
      zip_file: [null, Validators.required]
    });
    this.getAllGroups();
  }

  // Switch between add and view modes
  setMode(mode: string) {
    this.mode = mode;
    if (mode === 'view') {
      this.getTables();
    } else {
      this.getAllGroups();
    }
  }

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

  // Handle file selection for the zip file
  onLayerFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (fileExtension === 'zip') {
        this.tableForm.patchValue({ zip_file: file });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Please upload a valid zip file'
        });
        event.target.value = '';
        this.tableForm.patchValue({ zip_file: null });
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

  // Handle form submission for adding a new layer
  public onLayerSubmit() {
    if (this.tableForm.valid) {
      const formData = new FormData();

      const group_id = this.tableForm.get('group_id')?.value;
      const table_name = this.tableForm.get('table_name')?.value;
      const zip_file = this.tableForm.get('zip_file')?.value;

      console.log("Group ID:", group_id);
      console.log("Table Name:", table_name);
      console.log("Zip File:", zip_file);

      // Append the form controls to FormData
      formData.append('group_id', group_id);
      formData.append('table_name', table_name);
      formData.append('zip_file', zip_file);
      formData.forEach((key, value) => {
        console.log(key + "    " + value);
      })
      // Proceed with the API call
      this.tableService.createTable(formData).subscribe({
        next: (response) => {
          console.log(response);
          Swal.fire({
            title: 'Success!',
            text: 'New Data has been uploaded successfully.',
            icon: 'success',
            confirmButtonText: 'OK',
          });
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