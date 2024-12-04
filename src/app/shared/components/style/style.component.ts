import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { GroupService } from '../../services/group.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StyleService } from '../../services/style.service';
import Swal from 'sweetalert2';
import { LayerService } from '../../services/layer.service';
import { ActivatedRoute } from '@angular/router';
import { style } from '@angular/animations';
import { clippingParents } from '@popperjs/core';

@Component({
  selector: 'app-style',
  templateUrl: './style.component.html',
  styleUrls: ['./style.component.css']
})
export class StyleComponent implements OnInit {
  styleForm: FormGroup;
  stroke: boolean = false;
  fill: boolean = false;
  labelling: boolean = false;

  groups: any[] = [];
  layers: any[] = [];
  generatedSld: string = '';

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private styleService: StyleService,
    private http: HttpClient,
    private layerService: LayerService,
    private route: ActivatedRoute
  ) {
    this.styleForm = this.fb.group({
      group_name: ['', Validators.required],
      layer_name: ['', Validators.required],
      style_name: ['', Validators.required],
      vectorTyPe: [''],
      stroke: [false],
      stroke_color: ['#000000'],
      stroke_width: [1, [Validators.min(1), Validators.max(10)]],
      fill: [false],
      fill_color: ['#FFFFFF'],
      fill_opacity: [1, [Validators.min(0), Validators.max(1)]],
      labelling: [false],
      label_field: [''],
      label_color: ['#000000']
    });
  }
  layerName: any;
  styleName: any;
  ngOnInit(): void {

    this.getAllLayers();

    this.styleForm.get('stroke')?.valueChanges.subscribe(val => this.stroke = val);
    this.styleForm.get('fill')?.valueChanges.subscribe(val => this.fill = val);
    this.styleForm.get('labelling')?.valueChanges.subscribe(val => this.labelling = val);

    this.route.queryParams.subscribe(params => {
      this.layerName = params['layerName'];
      this.styleName = params['styleName'];
      this.patchValue()
    });

    this.fetchStyleInfo(this.styleName);

  }


  // data: any;

  fetchStyleInfo(styleName: string) {
    const username = "admin";
    const password = 'geoserver';
    const credentials = btoa(`${username}:${password}`);
    const url = `http://localhost:8080/geoserver/rest/styles/${styleName}.sld`;

    const headers = new HttpHeaders({
      'Accept': 'application/xml',
      'Authorization': 'Basic ' + `${credentials}`
    });

    this.http.get(url, { headers, responseType: 'text' })
      .subscribe(
        (data: any) => {
          console.log(data);
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, 'application/xml');

          if (xmlDoc.querySelector('PolygonSymbolizer')) {
            this.extractPolygonStyle(xmlDoc);
          } else if (xmlDoc.querySelector('LineSymbolizer')) {
            console.log("Detected vector type: Line");
            this.extractLineStyle(xmlDoc);
          } else if (xmlDoc.querySelector('PointSymbolizer')) {
            console.log("Detected vector type: Point");
            this.extractPointStyle(xmlDoc);
          }
          this.extractLabelStyle(xmlDoc);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  private extractPolygonStyle(xmlDoc: Document) {
    const fillColor = this.getCssParameter(xmlDoc, 'PolygonSymbolizer Fill', 'fill');
    const fillOpacity = this.getCssParameter(xmlDoc, 'PolygonSymbolizer Fill', 'fill-opacity');
    const strokeColor = this.getCssParameter(xmlDoc, 'PolygonSymbolizer Stroke', 'stroke');
    const strokeWidth = this.getCssParameter(xmlDoc, 'PolygonSymbolizer Stroke', 'stroke-width');

    this.styleForm.patchValue({
      fill_color: fillColor,
      fill_opacity: fillOpacity,
      stroke_color: strokeColor,
      stroke_width: strokeWidth
    });
    this.styleForm.get('stroke')?.setValue(true);
    this.styleForm.get('fill')?.setValue(true);
  }

  private extractLineStyle(xmlDoc: Document) {
    const strokeColor = this.getCssParameter(xmlDoc, 'LineSymbolizer Stroke', 'stroke');
    const strokeWidth = this.getCssParameter(xmlDoc, 'LineSymbolizer Stroke', 'stroke-width');
    this.styleForm.patchValue({
      stroke_color: strokeColor,
      stroke_width: strokeWidth
    });
    this.styleForm.get('stroke')?.setValue(true);
  }

  private extractPointStyle(xmlDoc: Document) {
    const fillColor = this.getCssParameter(xmlDoc, 'PointSymbolizer Fill', 'fill');
    const fillOpacity = this.getCssParameter(xmlDoc, 'PointSymbolizer Fill', 'fill-opacity');
    const strokeColor = this.getCssParameter(xmlDoc, 'PointSymbolizer Stroke', 'stroke');
    const strokeWidth = this.getCssParameter(xmlDoc, 'PointSymbolizer Stroke', 'stroke-width');
    this.styleForm.patchValue({
      fill_color: fillColor,
      fill_opacity: fillOpacity,
      stroke_color: strokeColor,
      stroke_width: strokeWidth
    });
    this.styleForm.get('stroke')?.setValue(true);
    this.styleForm.get('fill')?.setValue(true);

  }
  private extractLabelStyle(xmlDoc: Document) {
    const labelField = xmlDoc.querySelector('TextSymbolizer Label PropertyName')?.textContent;
    const labelColor = this.getCssParameter(xmlDoc, 'TextSymbolizer Fill', 'fill');
    this.styleForm.patchValue({
      label_field: labelField,
      label_color: labelColor
    });
    this.styleForm.get('labelling')?.setValue(true);
  }

  private getCssParameter(xmlDoc: Document, symbolizerPath: string, parameterName: string): string | null {
    const path = symbolizerPath.split(' ');
    let element = xmlDoc.querySelector(path.join(' > ')); // Traverse path to find symbolizer

    if (element) {
      const cssParam = Array.from(element.querySelectorAll('CssParameter')).find(
        (param) => param.getAttribute('name') === parameterName
      );
      return cssParam ? cssParam.textContent : null;
    }
    return null;
  }

  patchValue() {
    this.styleForm.patchValue({
      layer_name: this.layerName,
      style_name: this.styleName
    });
    this.layerService.getLayerColumns(this.layerName).subscribe({
      next: (data: { columns: string[], vectorType: any }) => {
        this.columns = data.columns;
        this.styleForm.get('vectorTyPe')?.setValue(data.vectorType); // Update the columns based on the response
        this.vectorType = data.vectorType;
      }
    });

  }


  toggleStrokeFields() {
    this.stroke = !this.stroke;
  }

  toggleFillFields() {
    this.fill = !this.fill;
  }
  toggleLabellingFields() {
    this.labelling = !this.labelling;
  }

  getAllGroups(): void {
    this.groupService.getAllGroups().subscribe({
      next: (response) => {
        this.groups = response.body.tgroups;
        console.log(this.groups);
      },
      error: (err) => {
        console.log(err.error);
      }
    });
  }

  getAllLayers(): void {
    this.groupService.getAllLayers().subscribe({
      next: (response) => {
        this.layers = response.body.tlayers;
        console.log(this.layers);
      },
      error: (err) => {
        console.log(err.error);
      }
    });
  }

  generateSld(): void {
    const formValues = this.styleForm.value;
    const layerName = formValues.layer_name;

    console.log(formValues);

    // Start generating the SLD
    let sld = `<?xml version="1.0" encoding="UTF-8"?>
    <StyledLayerDescriptor version="1.0.0"
        xmlns="http://www.opengis.net/sld"
        xmlns:ogc="http://www.opengis.net/ogc"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.opengis.net/sld
        http://schemas.opengis.net/sld/1.0.0/StyledLayerDescriptor.xsd">
        <NamedLayer>
            <Name>${layerName}</Name>
            <UserStyle>
                <Title>${formValues.style_name} style</Title>
                <FeatureTypeStyle>
                    <Rule>`;
    if (formValues.vectorTyPe == 'Polygon') {
      if (formValues.stroke) {
        sld += `
                        <PolygonSymbolizer>
                            <Stroke>
                                <CssParameter name="stroke">${formValues.stroke_color}</CssParameter>
                                <CssParameter name="stroke-width">${formValues.stroke_width}</CssParameter>
                            </Stroke>
                        </PolygonSymbolizer>`;
      }

      if (formValues.fill) {
        sld += `
                        <PolygonSymbolizer>
                            <Fill>
                                <CssParameter name="fill">${formValues.fill_color}</CssParameter>
                              
                                <CssParameter name="fill-opacity">${formValues.fill_opacity}</CssParameter>
                            </Fill>
                        </PolygonSymbolizer>`;
      }
    }

    if (formValues.vectorTyPe == 'Line') {
      if (formValues.stroke) {
        sld += `
        <LineSymbolizer>
        <Stroke>
        <CssParameter name="stroke">${formValues.stroke_color}</CssParameter>
        <CssParameter name="stroke-width">${formValues.stroke_width}</CssParameter>
        </Stroke>
      </LineSymbolizer>`;
      }
    }
    if (formValues.vectorTyPe == 'Point') {
      if (formValues.fill) {
        sld += `
        <PointSymbolizer>
        <Graphic>
          <Mark>
            <WellKnownName>circle</WellKnownName>
            <Fill>
            <CssParameter name="fill">${formValues.fill_color}</CssParameter>         
            <CssParameter name="fill-opacity">${formValues.fill_opacity}</CssParameter>
            </Fill>
          </Mark>
        <Size>6</Size>
      </Graphic>
      <Stroke>
                                <CssParameter name="stroke">${formValues.stroke_color}</CssParameter>
                                <CssParameter name="stroke-width">${formValues.stroke_width}</CssParameter>
                            </Stroke>
    </PointSymbolizer>`
      }
    }

    if (formValues.labelling && formValues.label_field) {
      sld += `
                        <TextSymbolizer>
                            <Label>
                                <ogc:PropertyName>${formValues.label_field}</ogc:PropertyName>
                            </Label>
                            <Font>
                                <CssParameter name="font-family">Arial</CssParameter>
                                <CssParameter name="font-size">12</CssParameter>
                                <CssParameter name="font-style">normal</CssParameter>
                                <CssParameter name="font-weight">bold</CssParameter>
                            </Font>
                            <Fill>
                                <CssParameter name="fill">${formValues.label_color}</CssParameter>
                            </Fill>
                            <Geometry>
                            <ogc:Function name="centroid">
                              <ogc:PropertyName>geometry</ogc:PropertyName>
                            </ogc:Function>
                          </Geometry>
                        </TextSymbolizer>`;
    }

    // Closing the SLD
    sld += `
                    </Rule>
                </FeatureTypeStyle>
            </UserStyle>
        </NamedLayer>
    </StyledLayerDescriptor>`;

    this.generatedSld = sld;

    this.createZip(sld);
    this.styleService.saveStyle(formValues.style_name, formValues.layer_name).subscribe({
      next: (response) => {
        Swal.fire({
          title: 'Success!',
          text: 'Style published successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        this.styleForm.reset()
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

  createZip(sldContent: string) {
    const zip = new JSZip();

    zip.file('dynamicstyle.sld', sldContent);
    zip.generateAsync({ type: 'blob' }).then((blob) => {
      const zipBlob = new Blob([blob], { type: 'application/zip' });

      saveAs(zipBlob, 'dynamicPoly.zip');
    }).catch((error) => {
      console.error('Error generating the ZIP file:', error);
    });
  }

  columns: any;
  vectorType: any
  onLayerSelect(layerName: any) {
    this.layerService.getLayerColumns(layerName.target.value).subscribe({
      next: (data: { columns: string[], vectorType: any }) => {
        this.columns = data.columns;
        this.styleForm.get('vectorTyPe')?.setValue(data.vectorType); // Update the columns based on the response
        this.vectorType = data.vectorType;
      },
      error: (err: any) => {
        console.error('Error fetching columns:', err);
        this.columns = [];  // Clear the columns in case of error
      }
    });
  }



  // onLayerSelect(event: any): void {
  //   const selectedLayer = event.target.value;
  //   if (selectedLayer) {
  //     this.fetchLayerColumns(selectedLayer);  // Fetch columns when layer is selected
  //   } else {
  //     this.columns = [];  // Clear columns if no layer is selected
  //   }
  // }

  // fetchLayerColumns(layerName: string): void {
  //   const url = `http://localhost:8080/geoserver/wfs?service=WFS&version=1.1.0&request=DescribeFeatureType&typeName=Dynamic_map:${layerName}
  //   `;  // FastAPI URL

  //   this.http.get<{ columns: string[] }>(url).subscribe({
  //     next: (data: { columns: string[] }) => {
  //       this.columns = data.columns;  // Update columns based on the response
  //     },
  //     error: (err) => {
  //       console.error('Error fetching columns:', err);
  //       this.columns = [];  // In case of error, clear the columns
  //     }
  //   });
  //}

  fetchLayerColumns(layerName: string): void {
    // Call the service method to fetch the columns from the FastAPI backend
    this.layerService.getLayerColumns(layerName).subscribe({
      next: (data: { columns: string[] }) => {
        this.columns = data.columns;

      },
      error: (err: any) => {
        console.error('Error fetching columns:', err);
        this.columns = [];  // Clear the columns in case of error
      }
    });
  }

}
