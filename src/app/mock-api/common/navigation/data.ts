/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example',
        roles : ['Admin','Mentor','Mentee']
    },
    {
        id   : 'dashboard',
        title: 'dashboard',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/dashboard',
        roles : ['Admin','Mentor','Mentee']
    },
    {
        id   : 'mentor',
        title: 'Mentor',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/mentor',
        roles : ['Admin']
    },
    {
        id   : 'mentor',
        title: 'Mentor',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/mentor/assigned-students/:userId',
        roles : ['Admin']
    },
    {
        id   : 'student',
        title: 'Student',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/student',
        roles : ['Admin','Mentor']
    },
    {
        id   : 'assignedstudent',
        title: 'assignedStudent',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/student/assigned-students',
        roles : ['Mentor']
    },
    {
        id   : 'viewprogress',
        title: 'View Progress',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/student/view-progress',
        roles : ['Admin','Mentor']
    },
    {
        id   : 'viewreport',
        title: 'View Report',
        type : 'basic',
        icon : 'heroicons_outline:chart-bar',
        link : '/student/view-report',
        roles : ['Admin','Mentor']
    },
    {
        id   : 'course',
        title: 'course',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/course',
        roles : ['Admin']
    },
    {
        id   : 'course',
        title: 'course',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/course/list',
        roles : ['Admin']
    },
    {
        id   : 'course',
        title: 'course',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/course/create',
        roles : ['Admin']
    },
    {
        id   : 'course',
        title: 'course',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/course/edit/:courseId',
        roles : ['Admin']
    },
    {
        id   : 'task-list',
        title: 'task-list',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/task',
        roles : ['Admin','Mentor','Mentee']
    },    
    {
        id   : 'task-list',
        title: 'task-list',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/task/list',
        roles : ['Mentor','Mentee']
    },
    {
        id   : 'task-list',
        title: 'task-list',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/task/assign',
        roles : ['Mentor']
    },
    {
        id   : 'task-edit',
        title: 'task-edit',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/task/edit/:guid',
        roles : ['Mentor']
    },
    {
        id   : 'task-list',
        title: 'task-list',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/task/kanban',
        roles : ['Mentee']
    },
    {
        id   : 'task-list',
        title: 'task-list',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/task/calendar',
        roles : ['Mentee']
    },
    {
        id   : 'task-list',
        title: 'task-list',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/task/mentor-kanban',
        roles : ['Mentor']
    },
    {
        id   : 'task-list',
        title: 'task-list',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/task/mentor-calendar',
        roles : ['Mentor']
    },
];
export const AdminNavigation: FuseNavigationItem[] = [
    {
        id   : 'mentor',
        title: 'Mentor Management',
        type : 'basic',
        icon : 'heroicons_outline:user-group',
        link : '/mentor'
    },
    {
        id   : 'student',
        title: 'Student Management',
        type : 'basic',
        icon : 'heroicons_outline:academic-cap',
        link : '/student'
    },
    {
        id   : 'course',
        title: 'Course Management',
        type : 'basic',
        icon : 'heroicons_outline:book-open',
        link : '/course/list'
    },
    {
        id   : 'viewprogress',
        title: 'View Progress',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/student/view-progress'
    },
    {
        id   : 'viewreport',
        title: 'View Report',
        type : 'basic',
        icon : 'heroicons_outline:chart-bar',
        link : '/student/view-report'
    },
];
export const MentorNavigation: FuseNavigationItem[] = [
    {
        id   : 'assignedstudent',
        title: 'Assigned Students',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/student/assigned-students'
    },
    {
        id   : 'task-list',
        title: 'Task List',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/task/list'
    }
];
export const MenteeNavigation: FuseNavigationItem[] = [
    // {
    //     id   : 'student',
    //     title: 'Student',
    //     type : 'basic',
    //     icon : 'heroicons_outline:chart-pie',
    //     link : '/student'
    // }
    {
        id   : 'task-list',
        title: 'Task List',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/task/list'
    }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
