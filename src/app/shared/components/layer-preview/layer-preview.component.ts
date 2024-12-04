import { Component, OnInit } from '@angular/core';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { OSM, TileWMS, XYZ } from 'ol/source';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { fromLonLat } from 'ol/proj';
import { LayerService } from '../../services/layer.service';

@Component({
  selector: 'app-layer-preview',
  templateUrl: './layer-preview.component.html',
  styleUrls: ['./layer-preview.component.css']
})
export class LayerPreviewComponent implements OnInit {
  private map!: Map;
  checkboxLayers: any[] = [];
  dropDownLayers: any[] = [];
  publishedLayers: any[] = [];
  layerTitles: { [key: string]: string } = {};
  public dropdownVisible = false;
  activeDropdown: string | null = null;
  layerVisibility: { [key: string]: boolean } = {};

  // New dictionary to store layer references
  private layerReferences: { [key: string]: TileLayer<any> } = {};

  constructor(private http: HttpClient, private layerService: LayerService) { }

  ngOnInit(): void {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        })
      ],
      view: new View({
        center: fromLonLat([34.1, 17.6]),
        zoom: 3.4,
      })
    });

    this.loadLayersFromSession();
    this.fetchPublishedLayers();
    this.getTableData();

  }


  private fetchPublishedLayers(): void {
    const geoserverUrl = 'http://localhost:8080/geoserver/rest/workspaces/Dynamic_map/layers';
    const username = 'admin';
    const password = 'geoserver';

    console.log('GeoServer URL:', geoserverUrl);
    this.http.get<any>(geoserverUrl, {
      headers: {
        'Authorization': 'Basic ' + btoa(`${username}:${password}`),
        'Accept': 'application/json'
      }
    }).pipe(
      catchError(error => {
        console.error('Error fetching layers from GeoServer:', error);
        return of({ layers: { layer: [] } });
      })
    ).subscribe(response => {
      if (response.layers && response.layers.layer) {
        this.publishedLayers = response.layers.layer;
        console.log(this.publishedLayers);

        this.setLayerVisibility();
        this.addPublishedLayersToMap(this.publishedLayers);
      } else {
        console.warn('No layers found in the response');
      }
    });
  }
  private setLayerVisibility(): void {
    this.publishedLayers.forEach(layer => {
      if (this.layerVisibility[layer.name] === undefined) {
        this.layerVisibility[layer.name] = true;
      }
    });
  }

  layerNames: any;
  public getTableData() {
    this.layerService.getTableData().subscribe({
      next: (response: any) => {
        this.layerNames = response.body.layers;
        console.log(response.body.layers);
      },
      error: (err) => {
        this.layerNames = [];
        console.log(err.error);
      }
    });
  }

  isLayerPublished(layerName: string): boolean {
    return this.layerNames.some((l: any) => l.layer_name === layerName);
  }

  private addPublishedLayersToMap(layers: any[]): void {
    layers.forEach(layer => {
      const tileLayer = new TileLayer({
        source: new TileWMS({
          url: 'http://localhost:8080/geoserver/wms',
          params: {
            'LAYERS': `Dynamic_map:${layer.name}`,
            'TILED': true,
            'FORMAT': 'image/png'
          },
          serverType: 'geoserver',
          crossOrigin: 'anonymous',
        }),
      });
      this.map.addLayer(tileLayer);
      this.layerReferences[layer.name] = tileLayer;

      this.layerTitles[layer.name] = layer.title || layer.name;
    });
  }

  toggleLayerVisibility(layerName: string, event: Event) {
    const input = event.target as HTMLInputElement;
    console.log("=================" + input.checked + "-----" + input);

    const isVisible = input ? input.checked : false;
    this.layerVisibility[layerName] = isVisible;

    if (isVisible) {
      this.showLayerOnMap(layerName);
    } else {
      this.hideLayerFromMap(layerName);
    }
  }

  private showLayerOnMap(layerName: string) {
    const layer = this.layerReferences[layerName];
    if (layer) {
      layer.setVisible(true);
    }
  }

  private hideLayerFromMap(layerName: string) {
    const layer = this.layerReferences[layerName];
    if (layer) {
      layer.setVisible(false);
    }
  }

  getLegendUrl(layerName: string): string {
    return `http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=Dynamic_map:${layerName}`;
  }

  private loadLayersFromSession(): void {
    const checkboxLayers = sessionStorage.getItem('checkboxLayers');
    const dropDownLayers = sessionStorage.getItem('dropDownLayers');

    if (checkboxLayers) {
      this.checkboxLayers = JSON.parse(checkboxLayers);
      this.addLayersToMap(this.checkboxLayers);
    }

    if (dropDownLayers) {
      this.dropDownLayers = JSON.parse(dropDownLayers);
      this.addLayersToMap(this.dropDownLayers);
    }
  }

  private addLayersToMap(layers: any[]): void {
    layers.forEach((layer: any) => {
      if (layer.type === 'TileLayer') {
        const tileLayer = new TileLayer({
          source: new XYZ({
            url: layer.url,
          }),
        });
        this.map.addLayer(tileLayer);
      }
    });
  }

  toggleDropdown(dropdownType: string) {
    if (this.activeDropdown === dropdownType) {
      this.dropdownVisible = !this.dropdownVisible;
    } else {
      this.activeDropdown = dropdownType;
      this.dropdownVisible = true;
    }
  }
}
