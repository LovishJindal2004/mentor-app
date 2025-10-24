import { Route, Routes } from "@angular/router";
import { AllCourseComponent } from "./all-course/all-course.component";

export default [
    {
        path: '',
        component: AllCourseComponent,
        data: {
          layout: ''
        },
    }
] as Routes