import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-boundary',
  templateUrl: './boundary.component.html',
  styleUrls: ['./boundary.component.css']
})
export class BoundaryComponent {
  public mode: string = "add";
  public regionForm!: any;
  public boundaries: any;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.regionForm = this.fb.group({
      regionName: ['', Validators.required],
      regionZipFile: [null, Validators.required]
    });
  }

  setMode(mode: string) {
    this.mode = mode;
    if (mode === 'add') {
    } else {

    }
  }


  onRegionFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop()?.toLowerCase();

      if (fileExtension === 'zip') {
        this.regionForm.patchValue({
          layerZipFile: file
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Please upload a valid zip file'
        })
        event.target.value = '';
        this.regionForm.patchValue({
          layerZipFile: null
        });
      }
    }
  }

  public onRegionSubmit(): void {
    if (this.regionForm.valid) {
      // this.areaOfInerest.saveRegion(this.regionForm.value).subscribe({
      //   next: (response) => {
      //     console.log(response.body);
      //     Swal.fire({
      //       icon: 'success',
      //       title: 'Success',
      //       confirmButtonText: 'OK'
      //     });
      //     // this.getRegion();
      //   },
      //   error: (error) => {
      //     console.log(error);
      //     Swal.fire({
      //       title: 'Error!',
      //       text: error.error,
      //       icon: 'error',
      //       confirmButtonText: 'OK'
      //     });
      //   }
      // });
    }
  }

}
