import { Component } from '@angular/core';

@Component({
  selector: 'app-app-config',
  templateUrl: './app-config.component.html',
  styleUrls: ['./app-config.component.css']
})
export class AppConfigComponent {
  appName: string = '';
  appAreaFile: File | null = null;

  baseMapOptions = [
    { label: 'Street Map', value: 'streetMap' },
    { label: 'Satellite', value: 'satellite' },
    { label: 'None', value: 'none' },
  ];

  spatialTools = [
    { label: 'Measurement', value: 'measurement' },
    { label: 'Zoom In/Out', value: 'zoom' },
    { label: 'Scale', value: 'scale' },
    { label: 'Home', value: 'home' },
  ];

  group1Layers = ['Layer 1', 'Layer 2'];
  group2Layers = ['Layer 3', 'Layer 4'];

  availableLayers = [...this.group1Layers, ...this.group2Layers]; // Combine both groups

  selectedDropdownLayer: string | null = null;
  dropdownLayer: string[] = []; // To store the layer moved to the dropdown
  selectedDropdownLayers: { layerName: string, nameField: string, nameFieldDropdown: string, valueField: string }[] = [];

  checkboxLayers: string[] = []; // To store the layers moved to the checkboxes

  dropdownOptions = ['Option 1', 'Option 2', 'Option 3'];

  // Add options for the new Name dropdown field
  nameDropdownOptions = ['Name Option 1', 'Name Option 2', 'Name Option 3'];

  // Handle the file input
  handleFileInput(event: any) {
    this.appAreaFile = event.target.files[0];
  }

  // Submit the form
  onSubmit() {
    const configData = {
      appName: this.appName,
      appAreaFile: this.appAreaFile?.name, // Only save the file name
      selectedDropdownLayers: this.selectedDropdownLayers,
      checkboxLayers: this.checkboxLayers,
    };

    // Save to session storage or handle submission logic
    sessionStorage.setItem('dropDownLayers', JSON.stringify(this.selectedDropdownLayers));
    sessionStorage.setItem('checkboxLayers', JSON.stringify(this.checkboxLayers));
  }

  // Reset form fields
  onReset() {
    this.appName = '';
    this.appAreaFile = null;
    this.selectedDropdownLayers = [];
    this.checkboxLayers = [];
    this.availableLayers = [...this.group1Layers, ...this.group2Layers]; // Reset available layers
    sessionStorage.removeItem('configData');
  }

  // Drag and drop handling for available layers to dropdown or checkbox
  onDragStart(event: DragEvent, layer: string) {
    event.dataTransfer?.setData('text/plain', layer);
    event.dataTransfer!.dropEffect = 'move';
  }

  // Allow dropping
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  // Drop into the dropdown layer
  onDropDropdown(event: DragEvent) {
    event.preventDefault();
    const layer = event.dataTransfer?.getData('text/plain');
    if (layer && !this.dropdownLayer.includes(layer)) {
      this.dropdownLayer = [layer]; // Only one layer allowed in the dropdown
      this.selectedDropdownLayer = layer;
      this.selectedDropdownLayers.push({
        layerName: layer,
        nameField: '',
        nameFieldDropdown: this.nameDropdownOptions[0], // Default to the first option
        valueField: ''
      });

      // Remove the layer from available layers
      this.availableLayers = this.availableLayers.filter(l => l !== layer);
    }
  }

  // Drop into the checkbox layers
  onDropCheckbox(event: DragEvent) {
    event.preventDefault();
    const layer = event.dataTransfer?.getData('text/plain');
    if (layer && !this.checkboxLayers.includes(layer)) {
      this.checkboxLayers.push(layer); // Multiple layers can be added
      // Remove the layer from available layers
      this.availableLayers = this.availableLayers.filter(l => l !== layer);
    }
  }

  // Remove a checkbox layer and add it back to available layers
  onRemoveCheckboxLayer(layer: string) {
    this.checkboxLayers = this.checkboxLayers.filter(l => l !== layer);
    if (!this.availableLayers.includes(layer)) {
      this.availableLayers.push(layer); // Add back to available layers
    }
  }

  // Remove a dropdown layer and add it back to available layers
  removeDropdownLayer(index: number) {
    const layer = this.selectedDropdownLayers[index].layerName;
    this.selectedDropdownLayers.splice(index, 1);
    if (!this.availableLayers.includes(layer)) {
      this.availableLayers.push(layer); // Add back to available layers
    }
    this.selectedDropdownLayer = null; // Clear the selected dropdown layer
    this.dropdownLayer = [];
  }
}
