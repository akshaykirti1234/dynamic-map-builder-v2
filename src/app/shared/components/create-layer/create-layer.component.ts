import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-layer',
  templateUrl: './create-layer.component.html',
  styleUrls: ['./create-layer.component.css']
})
export class CreateLayerComponent {
  public layers: any;
  public layerForm: any;
  mode: string = "add";

  constructor(private fb: FormBuilder) { }

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



  deleteLayer(arg0: any) {
    throw new Error('Method not implemented.');
  }
  publishLayer(arg0: any) {
    throw new Error('Method not implemented.');
  }
}
