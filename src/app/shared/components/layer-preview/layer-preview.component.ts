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
  public layers: any[] = [];
  public dropdownVisible = false; // Track dropdown visibility
  activeDropdown: string | null = null; // To track which dropdown is active

  checkboxLayers = ['Layer 1', 'Layer 2', 'Layer 3'];
  listLayers = ['Layer A', 'Layer B', 'Layer C'];

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
        zoom: 2,        // Default zoom
      })
    });

    // Load layers from session storage
    this.loadLayersFromSession();
  }

  // Method to load layers from session storage
  private loadLayersFromSession(): void {
    const storedLayers = sessionStorage.getItem('layers');
    if (storedLayers) {
      this.layers = JSON.parse(storedLayers);

      this.layers.forEach((layer: any) => {
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

  // Toggle dropdown based on the clicked button
  toggleDropdown(dropdownType: string) {
    if (this.activeDropdown === dropdownType) {
      // If the same dropdown is clicked again, close it
      this.dropdownVisible = !this.dropdownVisible;
    } else {
      // Switch to the other dropdown and ensure it is visible
      this.activeDropdown = dropdownType;
      this.dropdownVisible = true;
    }
  }
}
