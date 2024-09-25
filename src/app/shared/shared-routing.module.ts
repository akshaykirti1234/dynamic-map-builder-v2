import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CreateLayerComponent } from './components/create-layer/create-layer.component';
import { StyleComponent } from './components/style/style.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { BoundaryComponent } from './components/boundary/boundary.component';
import { LayerPreviewComponent } from './components/layer-preview/layer-preview.component';
import { GroupComponent } from './components/group/group.component';
import { NewDataComponent } from './components/new-data/new-data.component';
import { AppendComponent } from './components/append/append.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard', component: DashboardComponent, children: [
      { path: '', redirectTo: 'group', pathMatch: 'full' },
      { path: 'boundary', component: BoundaryComponent },
      { path: 'file', component: UploadFileComponent },
      { path: 'layer', component: CreateLayerComponent },
      { path: 'style', component: StyleComponent },
      { path: 'preview', component: LayerPreviewComponent },
      { path: 'group', component: GroupComponent },
      { path: 'new-data', component: NewDataComponent },
      { path: 'append', component: AppendComponent },
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule { }
