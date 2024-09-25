import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UploadFileService } from '../../services/upload-file.service';

@Component({
  selector: 'app-append',
  templateUrl: './append.component.html',
  styleUrls: ['./append.component.css']
})
export class AppendComponent {
  public layerForm: any;
  public layers: any;
  mode: string = "add";

  constructor(private fb: FormBuilder, private uploadFileService: UploadFileService) { }

  ngOnInit(): void {
    this.layerForm = this.fb.group({
      layerName: ['', Validators.required],
      layerZipFile: [null, Validators.required]
    });
  }

  setMode(mode: string) {
    this.mode = mode;
    if (mode === 'add') {
    } else {
      this.getLayers();
    }
  }


  onLayerFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop()?.toLowerCase();

      if (fileExtension === 'zip') {
        this.layerForm.patchValue({
          layerZipFile: file
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Please upload a valid zip file'
        })
        event.target.value = '';
        this.layerForm.patchValue({
          layerZipFile: null
        });
      }
    }
  }

  public getLayers(): void {
    this.uploadFileService.getLayers().subscribe({
      next: (response) => {
        console.log(response.body);
        this.layers = response.body;
      },
      error: (error) => {
        this.layers = [];
        console.error(error);
      }
    });
  }

  public onLayerSubmit() {
    if (this.layerForm.valid) {

      this.uploadFileService.saveLayer(this.layerForm.value).subscribe({
        next: (event) => {
          Swal.fire({
            title: 'Success!',
            text: 'Layer has been uploaded successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          // Reset the form
          this.layerForm.reset();
        },
        error: (error) => {
          console.error(error);
          // Show SweetAlert2 error message
          Swal.fire({
            title: 'Error!',
            text: error.error,
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
