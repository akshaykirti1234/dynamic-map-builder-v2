import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UploadFileService } from '../../services/upload-file.service';
import { GroupService } from '../../services/group.service';
import { TableService } from '../../services/table.service';
import { LayerService } from '../../services/layer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-layer',
  templateUrl: './create-layer.component.html',
  styleUrls: ['./create-layer.component.css']
})
export class CreateLayerComponent {
  public layers: any;
  public layerForm: any;
  mode: string = "add";
  vectorType: any
  constructor(private fb: FormBuilder, private layerService: LayerService, private groupService: GroupService, private tableService: TableService, private router: Router) { }

  ngOnInit(): void {
    this.layerForm = this.fb.group({
      group_id: ['', Validators.required],
      table_id: ['', Validators.required],
      layer_name: ['', Validators.required],
      style_name: ['']
    });
    this.getAllGroups();
    // this.fetchStyles();
  }

  setMode(mode: string) {
    this.mode = mode;
    if (mode === 'add') {
    } else {
      this.getTableData();
    }
  }

  styles: any;
  selectedStyle = '';
  fetchStyles(): void {
    this.layerService.fetchStyles().subscribe({
      next: (response: any) => {
        this.styles = response.styles;
        console.log(this.styles);
        // if (this.styles.includes('polygon')) {
        //   this.selectedStyle = 'polygon';
        if (this.styles.includes(this.vectorType)) {
          this.selectedStyle = this.vectorType;
        } else if (this.styles.length > 0) {
          this.selectedStyle = this.styles[0];
        }
      },
      error: (err) => {
        console.error('Error fetching styles:', err);
      }
    })
  }

  public getTableData() {
    this.layerService.getTableData().subscribe({
      next: (response: any) => {
        this.layers = response.body.layers;
        console.log(response.body.layers);
      },
      error: (err) => {
        this.groups = [];
        console.log(err.error);
      }
    })
  }

  groups: any;
  public getAllGroups(): void {
    this.groupService.getAllGroups().subscribe({
      next: (response) => {
        this.groups = response.body.tgroups;
        console.log(this.groups);
      },
      error: (err) => {
        this.groups = [];
        console.log(err.error);
      }
    });
  }

  tables: any;
  onGroupChange(group_id: any) {
    if (group_id) {
      this.tableService.getTablesByGroupId(group_id.target.value).subscribe({
        next: (response) => {
          this.tables = response.body.tables;
          console.log(this.tables);
        },
        error: (error) => {
          this.layers = [];
          console.error(error);
        }
      })
    } else {
      this.tables = [];  // Clear the tables if no group is selected
    }
  }

  onTableChange(table_id: any) {
    if (table_id) {
      this.tableService.getVectorTypeByTableId(table_id.target.value).subscribe({
        next: (data: any) => {
          //this.styleForm.get('vectorTyPe')?.setValue(data.vectorType); // Update the columns based on the response
          this.vectorType = data.vectorType;
          this.fetchStyles()
        },
        error: (error) => {
          this.layers = [];
          console.error(error);
        }
      })
    }
  }


  onLayerSubmit() {
    console.log(this.layerForm.value);
    this.layerService.saveLayer(this.layerForm.value).subscribe({
      next: (response: any) => {
        // Show success SweetAlert notification
        Swal.fire({
          title: 'Success!',
          text: response.body.msg,
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.layerForm.reset()
        this.ngOnInit();
      },
      error: (error: any) => {
        // Show error SweetAlert notification
        Swal.fire({
          title: 'Error!',
          text: 'Failed to save the layer.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        console.error('Layer save failed:', error);
      }
    });
  }

  deleteLayer(id: any) {
    this.layerService.deleteLayer(id).subscribe({
      next: (response) => {
        this.getTableData();
        Swal.fire({
          icon: 'success',
          title: 'Layer deleted successfully'
        })
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          // text: JSON.stringify(err.error.detail)
        })
        console.error('Error deleting group:', err);
      }
    });
  }
  publishLayer(id: any) {
    this.layerService.publishLayer(id).subscribe({
      next: (response: any) => {
        console.log(response.body);

        // Show success SweetAlert notification
        Swal.fire({
          title: 'Success!',
          text: 'Layer saved successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      },
      error: (error: any) => {
        // Show error SweetAlert notification
        Swal.fire({
          title: 'Error!',
          text: 'Failed to save the layer.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        console.error('Layer save failed:', error);
      }
    });
  }


  updateStyle(event: Event) {
    event.preventDefault();

    const layerName = this.layerForm.get('layer_name')?.value;
    const styleName = this.layerForm.get('style_name')?.value;

    if (layerName && styleName) {
      this.router.navigate(['/shared/dashboard/style'], { queryParams: { layerName: layerName, styleName: styleName } });
    } else {
      console.error('Layer Name or Style Name is missing');
    }
  }
}








// <!-- List for View/Delete -->
// <!-- <div *ngIf="mode === 'view'" class="table-responsive mt-3">
//     <table class="table table-bordered table-hover">
//         <thead>
//             <tr>
//                 <th>Group Name</th>
//                 <th>Layer Name</th>
//                 <!-- <th>Style</th> -->
//                 <th class="text-center">Action</th>
//             </tr>
//         </thead>
//         <tbody>
//             <tr>
//                 <td>Demographic Layer</td>
//                 <td>Road Layer</td>
//                 <!-- <td> <a routerLink="/shared/dashboard/style">add style</a> </td> -->
//                 <td>
//                     <div class="d-flex justify-content-center">
//                         <button class="btn btn-primary">Publish</button>
//                     </div>
//                 </td>
//             </tr>
//             <tr>
//                 <td>Demographic Layer</td>
//                 <td>Road Layer</td>
//                 <!-- <td> <a routerLink="/shared/dashboard/style">add style</a> </td> -->
//                 <td>
//                     <div class="d-flex gap-2 justify-content-around">
//                         <div class="d-flex align-items-center">
//                             <span class="text-success">Published</span>
//                         </div>
//                         <button class="btn btn-danger">Delete</button>
//                     </div>
//                 </td>
//             </tr>
//             <tr *ngFor="let layer of layers">
//                 <td>{{layer.name}}</td>
//                 <td>{{layer.name}}</td>
//                 <td>{{layer.name}}</td>
//                 <td>
//                     <div *ngIf="layer.published" class="d-flex justify-content-center">
//                         <button class="btn btn-primary" (click)="publishLayer(layer.id)">Publish</button>
//                     </div>
//                     <div *ngIf="!layer.published" class="d-flex gap-2 justify-content-around">
//                         <div class="d-flex align-items-center">
//                             <span class="text-success">Published</span>
//                         </div>
//                         <button class="btn btn-danger" (click)="deleteLayer(layer.id)">Delete</button>
//                     </div>
//                 </td>
//             </tr>
//         </tbody>
//     </table>
// </div> -->

