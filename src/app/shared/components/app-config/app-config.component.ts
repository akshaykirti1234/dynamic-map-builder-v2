import { Component } from '@angular/core';

@Component({
  selector: 'app-app-config',
  templateUrl: './app-config.component.html',
  styleUrls: ['./app-config.component.css']
})
export class AppConfigComponent {
  appName: string = '';
  appAreaFile: File | null = null;
  selectedLayers: string[] = [];
  draggedLayer: string | null = null; // Track the currently dragged layer

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

  handleFileInput(event: any) {
    this.appAreaFile = event.target.files[0];
  }

  onSubmit() {
    console.log({
      appName: this.appName,
      appAreaFile: this.appAreaFile,
      selectedLayers: this.selectedLayers,
    });

    sessionStorage.setItem("layers", JSON.stringify(this.selectedLayers));
  }

  onReset() {
    this.appName = '';
    this.appAreaFile = null;
    this.selectedLayers = [];
  }

  onDragStart(event: DragEvent, layer: string) {
    this.draggedLayer = layer; // Store the currently dragged layer
    event.dataTransfer?.setData('text/plain', layer); // Send the layer name
    event.dataTransfer!.dropEffect = 'move';
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (!this.draggedLayer) return; // If there's no layer being dragged, exit

    // Check if the dragged layer is already in the selected layers
    if (!this.selectedLayers.includes(this.draggedLayer)) {
      this.selectedLayers.push(this.draggedLayer); // Add to selected layers
    }

    this.draggedLayer = null; // Reset dragged layer
  }

  onDragOver(event: DragEvent) {
    event.preventDefault(); // Prevent default to allow drop
  }

  onRemoveLayer(layer: string) {
    this.selectedLayers = this.selectedLayers.filter(l => l !== layer); // Remove layer from selected layers
  }
}
