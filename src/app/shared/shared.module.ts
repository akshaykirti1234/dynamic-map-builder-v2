import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { CreateLayerComponent } from './components/create-layer/create-layer.component';
import { StyleComponent } from './components/style/style.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LayerPreviewComponent } from './components/layer-preview/layer-preview.component';
import { BoundaryComponent } from './components/boundary/boundary.component';
import { GroupComponent } from './components/group/group.component';
import { NewDataComponent } from './components/new-data/new-data.component';
import { AppendComponent } from './components/append/append.component';


@NgModule({
  declarations: [
    UploadFileComponent,
    CreateLayerComponent,
    StyleComponent,
    DashboardComponent,
    LayerPreviewComponent,
    BoundaryComponent,
    GroupComponent,
    NewDataComponent,
    AppendComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
