import { BooleanInput } from '@angular/cdk/coercion';
import { CommonModule, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { FuseDrawerComponent } from '@fuse/components/drawer';
import { DataGuardService } from 'app/core/auth/guards/dataGuard';
import { helperService } from 'app/core/auth/helper';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { CommanService } from 'app/modules/common/services/common.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'user',
    imports: [
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        // NgClass,
        MatDividerModule,
        
        MatExpansionModule,
        // MatDrawer,
        FuseDrawerComponent,
        CommonModule
    ],
})
export class UserComponent implements OnInit, OnDestroy {
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_showAvatar: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() showAvatar: boolean = true;
    user: User;
    UserName: any;
    _userAccount: any;
    courses: any;
    Courseid: any;
    selectedCourse: any = [];
    url = 'my-images/Businessman-Transparent.png';

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    UsercurrentInfo: any;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _helperService: helperService,
        private _commonService: CommanService,
        private _datagurd: DataGuardService,
        private _userService: UserService
    ) {
        this._commonService.getProfile().subscribe(res=>{
            this.UsercurrentInfo = res;
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to user changes
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
            this._userAccount = this._helperService.getUserDetail();
            this.getCourses();
            this.UserName = localStorage.getItem('studentName');
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    getCourses() {

        this.Courseid = this._datagurd.getCourseId();
        this._commonService.getActiveCoursesByUserId(this._userAccount?.Id).subscribe(res => {
            if (res)
                this.courses = res;
            this.selectedCourse = this.courses.filter(course => course.courseId == this.Courseid)[0].courseName;
            // console.log(this.selectedCourse);
        })
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update the user status
     *
     * @param status
     */
    updateUserStatus(status: string): void {
        // Return if user is not available
        if (!this.user) {
            return;
        }

        // Update the user
        this._userService
            .update({
                ...this.user,
                // status,
            })
            .subscribe();
    }
    SetCourseId(id) {
        this.selectedCourse = this.courses.filter(course => course.courseId == id)[0].courseName;
        this._datagurd.setCourseId('Courseid', id);
        this._commonService.setCourseId(id);
        this._router.navigate(['/dashboard']);
        setTimeout(() => {
            window.location.reload();            
        }, 500);
    }

    /**
     * Sign out
     */
    signOut(): void {
        this._router.navigate(['/sign-out']);
    }
}
