import { Routes } from '@angular/router';
import { ListCourseComponent } from './list-course/list-course.component';
import { CourseFormComponent } from './course-form/course-form.component';

export default [
    {
        path     : 'list',
        component: ListCourseComponent,
    },
    {
        path     : 'create',
        component: CourseFormComponent,
    },
    {
        path     : 'edit/:courseId',
        component: CourseFormComponent,
    },
] as Routes;
