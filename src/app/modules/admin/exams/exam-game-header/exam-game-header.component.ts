import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FuseConfigService } from '@fuse/services/config';
import { CommanService } from 'app/modules/common/services/common.service';

@Component({
  selector: 'app-exam-game-header',
  imports: [MatIconModule, CommonModule],
  templateUrl: './exam-game-header.component.html',
  styleUrl: './exam-game-header.component.scss'
})
export class ExamGameHeaderComponent implements OnInit {

  LogoUrl: string;
  @Output() dataEvent = new EventEmitter<string>();
  @Input() subjectName: any;
  @Input() examType: any;
  @Input() isfromMarksheet: any = false;
  @Input() Examtitle: any;
  @Input() hidetracker: any = false;
  @Input() hideinstructions: any = false;
  themeName:string=''
  constructor(private _CommanService: CommanService, private _fuseConfigService: FuseConfigService, private dialog: MatDialog,private sanitizer:DomSanitizer) {
    this._CommanService.getTenantDetails.subscribe((TenantInfo: any) => {
      this.LogoUrl = TenantInfo.Logo;
      this._fuseConfigService.config = { theme: TenantInfo.ThemeID };
      this._fuseConfigService.config = { scheme: TenantInfo['SchemaID']?.toLowerCase() };
    });
  }
  sendDataToExamView(Data: string) {
    const data = Data;
    this.dataEvent.emit(data);
  }
  ngOnInit(): void {
    this._CommanService.getTenantDetails.subscribe((TenantInfo: any) => {
      this.LogoUrl = TenantInfo.Logo;
      this.themeName=TenantInfo.ThemeID;
      // this._title.setTitle(TenantInfo.tenantDetails?.Slogan);

    });
  }
  closedialog() {
    this.dialog.closeAll();
    this.dataEvent.emit("leave");
  }
  sanitizeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

}
