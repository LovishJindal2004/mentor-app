import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FuseConfigService } from '@fuse/services/config';
import { CommanService } from 'app/modules/common/services/common.service';

@Component({
  selector: 'app-qbank-game-header',
  imports: [MatIconModule, CommonModule],
  templateUrl: './qbank-game-header.component.html',
  styleUrl: './qbank-game-header.component.scss'
})
export class QbankGameHeaderComponent implements OnInit {
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
