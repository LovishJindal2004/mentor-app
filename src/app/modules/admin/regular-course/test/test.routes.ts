import { Routes } from "@angular/router";
import { TestListComponent } from "./test-list/test-list.component";

export default [
    {
        path:'list/:categoryname/:examtype',
        component: TestListComponent
    }
] as Routes 