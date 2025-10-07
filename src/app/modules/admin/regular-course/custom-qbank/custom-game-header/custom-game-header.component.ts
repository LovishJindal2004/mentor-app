import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { FuseConfigService } from '@fuse/services/config';
import { CommanService } from 'app/modules/common/services/common.service';

@Component({
  selector: 'app-custom-game-header',
  imports:[CommonModule,
    MatIconModule,
    MatStepperModule,
    MatRadioModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatExpansionModule,
    MatSelectModule,
    MatNativeDateModule,
    MatMenuModule,
    MatProgressBarModule,
    MatListModule,
    ClipboardModule,
    MatSnackBarModule,
    MatSlideToggleModule],
    standalone: true,
  templateUrl: './custom-game-header.component.html',
  styleUrls: ['./custom-game-header.component.scss']
})
export class CustomGameHeaderComponent  implements OnInit {
  LogoUrl: string;
  @Output() dataEvent = new EventEmitter<string>();
  @Input() examid : any;
  @Input() subjectName : any;
  @Input() topicName : any;
  @Input() isfromMarksheet :any=false;
  @Input() hidetraker:any=false;
  constructor(private _CommanService: CommanService,  private _fuseConfigService: FuseConfigService,private dialog: MatDialog,) {
    this._CommanService.getTenantDetails.subscribe((TenantInfo: any) => {
      this.LogoUrl = TenantInfo.Logo;
      this._fuseConfigService.config = {theme:TenantInfo.ThemeID};
      this._fuseConfigService.config = {scheme:TenantInfo['SchemaID']?.toLowerCase()};
    });
  }
  sendDataToExamView(Data: string) {
    const data = Data;
    this.dataEvent.emit(data);
  }
  ngOnInit(): void {
    this._CommanService.getTenantDetails.subscribe((TenantInfo: any) => {
      this.LogoUrl = TenantInfo.Logo;
      // this._title.setTitle(TenantInfo.tenantDetails?.Slogan);

  });
  }
  closedialog() {
    this.dialog.closeAll();
    this.dataEvent.emit("leave");
  }
}

// export class CustomGameHeaderComponent implements OnInit {
//   LogoUrl: string;
//   @Output() dataEvent = new EventEmitter<string>();
//   @Input() examid: any;
//   @Input() isfromMarksheet: any = false;
//   @Input() startExamTime: any = false;
//   constructor(private _CommanService: CommanService, private _fuseConfigService: FuseConfigService, private dialog: MatDialog,) {
//     this._CommanService.getTenantDetails.subscribe((TenantInfo: any) => {
//       this.LogoUrl = TenantInfo.Logo;
//       this._fuseConfigService.config = { theme: TenantInfo.ThemeID };
//       this._fuseConfigService.config = { scheme: TenantInfo['SchemaID']?.toLowerCase() };
//     });
//   }

//   sendDataToExamView(Data: string) {
//     const data = Data;
//     this.dataEvent.emit(data);
//   }
//   ngOnInit(): void {
//     this._CommanService.getTenantDetails.subscribe((TenantInfo: any) => {
//       this.LogoUrl = TenantInfo.Logo;
//       // this._title.setTitle(TenantInfo.tenantDetails?.Slogan);

//     });
//   }
//   closedialog() {
//     this.dialog.closeAll();
//   }

// }
