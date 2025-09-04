import { Injectable } from '@angular/core';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { helperService } from 'app/core/auth/helper';
import {
    AdminNavigation,
    compactNavigation,
    defaultNavigation,
    futuristicNavigation,
    horizontalNavigation,
    MenteeNavigation,
    MentorNavigation,
} from 'app/mock-api/common/navigation/data';
import { cloneDeep } from 'lodash-es';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NavigationMockApi {
    private readonly _compactNavigation: FuseNavigationItem[] =
        compactNavigation;
    private readonly _defaultNavigation: FuseNavigationItem[] =
    AdminNavigation;
    private readonly _futuristicNavigation: FuseNavigationItem[] =
        futuristicNavigation;
    private readonly _horizontalNavigation: FuseNavigationItem[] =
        horizontalNavigation;
    private readonly _AdminNavigation: FuseNavigationItem[] = AdminNavigation;
    private readonly _MentorNavigation: FuseNavigationItem[] = MentorNavigation;
    private readonly _MenteeNavigation: FuseNavigationItem[] = MenteeNavigation;
    userDetail: any;
    isnavigationalreadyexiest: boolean = false;
    latestNavigation: any = [];

    /**
     * Constructor
     */
    constructor(
        private _fuseMockApiService: FuseMockApiService,
        private _helpService: helperService,
    ) {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    // registerHandlers(): void {
    //     // -----------------------------------------------------------------------------------------------------
    //     // @ Navigation - GET
    //     // -----------------------------------------------------------------------------------------------------
    //     this._fuseMockApiService.onGet('api/common/navigation').reply(() => {
    //         // Fill compact navigation children using the default navigation
    //         this._compactNavigation.forEach((compactNavItem) => {
    //             this._defaultNavigation.forEach((defaultNavItem) => {
    //                 if (defaultNavItem.id === compactNavItem.id) {
    //                     compactNavItem.children = cloneDeep(
    //                         defaultNavItem.children
    //                     );
    //                 }
    //             });
    //         });

    //         // Fill futuristic navigation children using the default navigation
    //         this._futuristicNavigation.forEach((futuristicNavItem) => {
    //             this._defaultNavigation.forEach((defaultNavItem) => {
    //                 if (defaultNavItem.id === futuristicNavItem.id) {
    //                     futuristicNavItem.children = cloneDeep(
    //                         defaultNavItem.children
    //                     );
    //                 }
    //             });
    //         });

    //         // Fill horizontal navigation children using the default navigation
    //         this._horizontalNavigation.forEach((horizontalNavItem) => {
    //             this._defaultNavigation.forEach((defaultNavItem) => {
    //                 if (defaultNavItem.id === horizontalNavItem.id) {
    //                     horizontalNavItem.children = cloneDeep(
    //                         defaultNavItem.children
    //                     );
    //                 }
    //             });
    //         });

    //         // Return the response
    //         return [
    //             200,
    //             {
    //                 compact: cloneDeep(this._compactNavigation),
    //                 default: cloneDeep(this._defaultNavigation),
    //                 futuristic: cloneDeep(this._futuristicNavigation),
    //                 horizontal: cloneDeep(this._horizontalNavigation),
    //             },
    //         ];
    //     });
    // }
    registerHandlers(): void {
        this._fuseMockApiService.onGet('api/common/navigation').reply((data) => {
            return new Observable((observer) => {
                // Determine navigation based on user role
                this.userDetail = this._helpService.getUserDetail();
                let navigation: any;

                if (this.userDetail?.Roles == "Admin") {
                    navigation = this._AdminNavigation;
                } else if (this.userDetail?.Roles == "Mentor") {
                    navigation = this._MentorNavigation;
                } else if (this.userDetail?.Roles == "Mentee") {
                    navigation = this._MenteeNavigation;
                }

                // Populate children for different navigation types
                this._compactNavigation.forEach((compactNavItem) => {
                    navigation?.forEach((defaultNavItem) => {
                        if (defaultNavItem.id === compactNavItem.id) {
                            compactNavItem.children = cloneDeep(defaultNavItem.children);
                        }
                    });
                });

                // Fetch dynamic navigation
                this.fetchDynamicNavigation(navigation)
                    .then((dynamicNavigation) => {
                        observer.next([
                            200,
                            {
                                compact: cloneDeep(dynamicNavigation || navigation),
                                default: cloneDeep(dynamicNavigation || navigation),
                                futuristic: cloneDeep(dynamicNavigation || navigation),
                                horizontal: cloneDeep(dynamicNavigation || navigation)
                            }
                        ]);
                        observer.complete();
                    })
                    .catch((error) => {
                        console.error("Error in navigation handler:", error);
                        observer.next([
                            500,
                            { error: 'Failed to fetch navigation' }
                        ]);
                        observer.complete();
                    });
            });
        });
    }


    private getNavigationLink(type: string, category: any): string {
        switch (type) {
            case 'Exams':
                if (category.batchName == 'Waiting For Approval') {
                    return `/exam/list/waiting-for-approval`;
                } else {
                    return `/exam/list/${category.batchYearId}`;
                }
            case 'Students':
                return `/student/list/${category.guid}`;
            case 'Lecturers':
                return `/lecturer/list/${category.guid}`;
            case 'Batch':
                return `/batch/${category.guid}`;
            case 'Student':
                return `/students/${category.guid}`;
            case 'Assigned Student':
                return `/students/lecturer/${category.guid}`;
            case 'Subgroup':
                return `/batch/sub-group/${category.guid}`;
            default:
                return '';
        }
    }

    fetchDynamicNavigation(navigation): Promise<any> {
        return new Promise(async (resolve, reject) => {
            if (!navigation) {
                resolve(null);
                return;
            }

            try {
                const processedNavs = new Set();

                for (const nav of navigation) {
                    if ((nav.title === 'Exams' ) &&
                        !processedNavs.has(nav.title)) {

                        processedNavs.add(nav.title);

                        // if (!this.isnavigationalreadyexiest) {
                        try {
                            nav.children = [];
                            nav?.forEach(category => {
                                const existingNavItem = nav.children.find(child =>
                                    child.title === category.name);

                                if (!existingNavItem) {
                                    if (nav.title === 'Batch' || nav.title === 'Assigned Student' || nav.title === 'Student' || nav.title === 'Subgroup' || nav.title === 'Lecturers') {
                                        nav.children.push({
                                            id: category.name,
                                            title: category.name,
                                            type: 'basic',
                                            link: this.getNavigationLink(nav.title, category),
                                        });
                                    } else if (nav.title === 'Exams') {
                                        // First, handle the special "Waiting For Approval" category
                                        if (category.batchName === 'Waiting For Approval') {
                                            nav.children.push({
                                                id: category.batchName,
                                                title: category.batchName + ' ' + `(${category.count})`,
                                                type: 'basic',
                                                link: this.getNavigationLink(nav.title, category),
                                            });
                                        } else {
                                            // For other categories, group by batchName
                                            const batchParentId = category.batchName.replace(/\s+/g, '-').toLowerCase();
                                            
                                            // Check if parent batch already exists
                                            let batchParent = nav.children.find(item => item.id === batchParentId);
                                            
                                            if (!batchParent) {
                                                // Create parent if it doesn't exist
                                                batchParent = {
                                                    id: batchParentId,
                                                    title: category.batchName,
                                                    type: 'collapsable',
                                                    children: []
                                                };
                                                nav.children.push(batchParent);
                                            }
                                            
                                            // Add year item as child of batch parent
                                            batchParent.children.push({
                                                id: `${batchParentId}-${category.batchYearId}`,
                                                title: category.batchYear + ' ' + `(${category.count})`,
                                                type: 'basic',
                                                link: this.getNavigationLink(nav.title, category),
                                            });
                                        }
                                    } else {
                                        nav.children.push({
                                            id: category.name,
                                            title: category.name + ' ' + `(${category.count})`,
                                            type: 'basic',
                                            link: this.getNavigationLink(nav.title, category),
                                        });
                                    }

                                }
                            });
                        } catch (error) {
                            console.error(`Error fetching ${nav.title} navigation:`, error);
                        }
                        // }
                    }
                }

                this.isnavigationalreadyexiest = true;
                resolve(navigation);
            } catch (error) {
                this.isnavigationalreadyexiest = false;
                reject(error);
            }
        });
    }
}
