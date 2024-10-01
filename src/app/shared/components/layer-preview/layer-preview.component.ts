import { Component, OnInit } from '@angular/core';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { OSM, XYZ } from 'ol/source';

@Component({
  selector: 'app-layer-preview',
  templateUrl: './layer-preview.component.html',
  styleUrls: ['./layer-preview.component.css']
})
export class LayerPreviewComponent implements OnInit {
  private map!: Map;
  checkboxLayers: any[] = [];
  dropDownLayers: any[] = [];
  public dropdownVisible = false; // Track dropdown visibility
  activeDropdown: string | null = null; // To track which dropdown is active

  ngOnInit(): void {
    // Initialize the map with a base layer (OSM)
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(), // OpenStreetMap base layer
        })
      ],
      view: new View({
        center: [0, 0], // Center of the map
        zoom: 2,        // Default zoom level
      })
    });

    // Load layers from session storage
    this.loadLayersFromSession();
  }

  // Method to load layers from session storage
  private loadLayersFromSession(): void {
    const checkboxLayers = sessionStorage.getItem('checkboxLayers');
    const dropDownLayers = sessionStorage.getItem('dropDownLayers');

    // Parse and load checkbox and dropdown layers
    if (checkboxLayers && dropDownLayers) {
      this.checkboxLayers = JSON.parse(checkboxLayers);
      this.dropDownLayers = JSON.parse(dropDownLayers);

      this.checkboxLayers.forEach((layer: any) => {
        if (layer.type === 'TileLayer') {
          const tileLayer = new TileLayer({
            source: new XYZ({
              url: layer.url, // URL from session storage
            }),
          });
          this.map.addLayer(tileLayer); // Add the layer to the map
        }
      });
    }
  }

  // Toggle dropdown visibility based on the clicked button
  toggleDropdown(dropdownType: string) {
    if (this.activeDropdown === dropdownType) {
      // If the same dropdown is clicked again, close it
      this.dropdownVisible = !this.dropdownVisible;
    } else {
      // Switch to the other dropdown and ensure it's visible
      this.activeDropdown = dropdownType;
      this.dropdownVisible = true;
    }
  }
}
