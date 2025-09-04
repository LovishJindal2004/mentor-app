import { Routes } from '@angular/router';
import { StudentListComponent } from './student-list/student-list.component';
import { AssignedStudentComponent } from './assigned-student/assigned-student.component';

export default [
    {
        path     : '',
        component: StudentListComponent,
    },
    {
        path     : 'assigned-students',
        component: AssignedStudentComponent,
    },
] as Routes;
