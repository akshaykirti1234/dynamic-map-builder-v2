import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent {
  mode: string = "add";
  form: FormGroup;
  showDropdownFields = false;
  showCheckboxFields = false;
  showSearchFields = false;

  constructor(private fb: FormBuilder) {
    // Initialize the form
    this.form = this.fb.group({
      filterName: [''],
      description: [''],
      type: [''],
      targetTable: [''],
      labelingName: [''],
      name: [''],
      value: [''],
      targetField: [''],
      targetLayer: [''],
      layerFields: this.fb.group({
        layer1: [false],
        layer2: [false],
        layer3: [false]
      })
    });
  }

  setMode(mode: string) {
    this.mode = mode;
    if (mode === 'add') {
    } else {

    }
  }

  // Function to handle radio button change event
  onTypeChange(type: string) {
    this.showDropdownFields = type === 'dropdown';
    this.showCheckboxFields = type === 'checkbox';
    this.showSearchFields = type === 'search';
  }

  // Reset form
  onReset() {
    this.form.reset();
    this.showDropdownFields = false;
    this.showCheckboxFields = false;
    this.showSearchFields = false;
  }

  // Submit form
  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
