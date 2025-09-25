import { Routes } from "@angular/router";
import { SubjectListComponent } from "./subject-list/subject-list.component";
import { ExamListComponent } from "./exam-list/exam-list.component";

export default [
    {
        path: 'subjects',
        component: SubjectListComponent
    },
    {
        path: 'exam-list/:subjectId',
        component: ExamListComponent
    },
] as Routes