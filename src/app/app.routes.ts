import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard, ChildAuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { CourseGuard } from './core/auth/guards/course.guard';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    {path: '', pathMatch : 'full', redirectTo: 'dashboard'},

    // Redirect signed-in user to the '/example'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'dashboard'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.routes')},
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.routes')},
            {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.routes')},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes')},
            {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes')}
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes')},
            {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.routes')}
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'home', loadChildren: () => import('app/modules/landing/home/home.routes')},
        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard, ChildAuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'example', loadChildren: () => import('app/modules/admin/example/example.routes')},
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard, ChildAuthGuard],
        canActivateChild: [AuthGuard, ChildAuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'dashboard', loadChildren: () => import('app/modules/admin/dashboard/dashboard.routes')},
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard, ChildAuthGuard],
        canActivateChild: [AuthGuard, ChildAuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'mentor', loadChildren: () => import('app/modules/admin/mentor-management/mentor.routes')},
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard, ChildAuthGuard],
        canActivateChild: [AuthGuard, ChildAuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'student', loadChildren: () => import('app/modules/admin/student-management/student.routes')},
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard, ChildAuthGuard],
        canActivateChild: [AuthGuard, ChildAuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'course', loadChildren: () => import('app/modules/admin/course-management/course.routes')},
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard, ChildAuthGuard,CourseGuard],
        canActivateChild: [AuthGuard, ChildAuthGuard,CourseGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'task', loadChildren: () => import('app/modules/admin/task-managament/task.routes')},
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard, ChildAuthGuard,CourseGuard],
        canActivateChild: [AuthGuard, ChildAuthGuard,CourseGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'qbank', loadChildren: () => import('app/modules/admin/qbank/qbank.routes')},
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard, ChildAuthGuard,CourseGuard],
        canActivateChild: [AuthGuard, ChildAuthGuard,CourseGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'exams', loadChildren: () => import('app/modules/admin/exams/exams.routes')},
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard, ChildAuthGuard],
        canActivateChild: [AuthGuard, ChildAuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'chat', loadChildren: () => import('app/modules/admin/chat/chat.routes')},
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard, ChildAuthGuard,CourseGuard],
        canActivateChild: [AuthGuard, ChildAuthGuard,CourseGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'qbanks', loadChildren: () => import('app/modules/admin/regular-course/qbank/qbanks.routes')},
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard, ChildAuthGuard,CourseGuard],
        canActivateChild: [AuthGuard, ChildAuthGuard,CourseGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'exam-management', loadChildren: () => import('app/modules/admin/regular-course/test/test.routes')},
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard, ChildAuthGuard,CourseGuard],
        canActivateChild: [AuthGuard, ChildAuthGuard,CourseGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'CustomQbank', loadChildren: () => import('app/modules/admin/regular-course/custom-qbank/custom-qbank.routes')},
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard, ChildAuthGuard],
        canActivateChild: [AuthGuard, ChildAuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'all-course', loadChildren: () => import('app/modules/admin/all-course/all-course.routes')},
        ]
    }
];
