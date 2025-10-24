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
        id   : 'course',
        title: 'course',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/all-course',
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
        id   : 'assignedcourse',
        title: 'assignedcourse',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/student/assigned-course/:userId',
        roles : ['Admin']
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
        id   : 'assigned-students',
        title: 'assigned-students',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/task/assigned-students/:taskId',
        roles : ['Mentor','Mentee']
    },
    {
        id   : 'Report-student',
        title: 'Report-student',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/task/report/:taskId/:menteeId',
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
    {
        id   : 'qbank-details',
        title: 'qbank-details',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/qbank',
        roles : ['Mentee']
    },
    {
        id   : 'qbank-details',
        title: 'qbank-details',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/qbank/details/:examId/:taskId',
        roles : ['Mentee']
    },
    {
        id   : 'qbank-details',
        title: 'qbank-details',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/qbank/game-view/:examId/:taskId',
        roles : ['Mentee']
    },
    {
        id   : 'qbank-details',
        title: 'qbank-details',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/qbank/game-review/:examId/:taskId',
        roles : ['Mentee']
    },
    {
        id   : 'qbank-details',
        title: 'qbank-details',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/qbank/game-analytics/:examId/:taskId',
        roles : ['Mentee']
    },
    {
        id   : 'exam',
        title: 'exam',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/exams',
        roles : ['Mentee']
    },
    {
        id   : 'exam-game',
        title: 'exam-game',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/exams/game-view/:examId/:taskId',
        roles : ['Mentee']
    },
    {
        id   : 'exam-review',
        title: 'exam-review',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/exams/game-review/:examId/:taskId',
        roles : ['Mentee']
    },
    {
        id   : 'exam-analytics',
        title: 'exam-analytics',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/exams/game-analytics/:examId/:taskId',
        roles : ['Mentee']
    },
    {
        id: 'chat',
        title: 'chat',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/chat',
        roles: ['Mentor', 'Mentee'],
        children: [
            {
                id: 'new-chat',
                title: 'new-chat',
                type: 'basic',
                icon: 'heroicons_outline:chart-pie',
                link: '/:id',
                roles: ['Mentor']
            },
            {
                id: 'new-chat',
                title: 'new-chat',
                type: 'basic',
                icon: 'heroicons_outline:chart-pie',
                link: '/new-chat/:id',
                roles: ['Mentor']
            }
        ]
    },
    {
        id   : 'qbank-list',
        title: 'qbank-list',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/qbanks',
        roles : ['Mentee']
    },
    {
        id   : 'qbank-list',
        title: 'qbank-list',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/qbanks/subjects',
        roles : ['Mentee']
    },
    {
        id   : 'exam-list',
        title: 'exam-list',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/qbanks/exam-list/:subjectId',
        roles : ['Mentee']
    },
    {
        id   : 'test-list',
        title: 'test-list',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/exam-management',
        roles : ['Mentee']
    },
    {
        id: 'gameview',
        title: 'Game View',
        type: 'basic',
        link: '/exam-management/game-view/:examId',
        roles: ["Mentee"]
    },
    {
        id: 'game-analytics',
        title: 'game-analytics',
        type: 'basic',
        link: '/exam-management/game-analytics/:examId',
        roles: ["Mentee"]
    },
    {
        id: 'game-analytics',
        title: 'game-analytics',
        type: 'basic',
        link: '/exam-management/game-reviews/:examId/:Questionid',
        roles: ["Mentee"]
    },
    {
        id: 'game-analytics',
        title: 'game-analytics',
        type: 'basic',
        link: '/exam-management/game-review/:examId',
        roles: ["Mentee"]
    },
    {
        id: 'exams management',
        title: 'Exams Management',
        type: 'collapsable',
        children: [            
            {
                id: 'grandtest',
                title: 'Grand Test',
                type: 'basic',
                link: '/exam-management/list/:categoryname/:examtype',
                roles: ["Mentee"]
            },
            {
                id: 'grandtest',
                title: 'Grand Test',
                type: 'basic',
                link: '/exam-management/list/PYQ/3',
                roles: ["Mentee"]
            },
            {
                id: 'grandtest',
                title: 'Grand Test',
                type: 'basic',
                link: '/exam-management/list/PYQ/3/examtype',
                roles: ["Mentee"]
            },
            {
                id: 'cbtgameview',
                title: 'cbt Game View',
                type: 'basic',
                link: '/exam-management/cbtgameview/:examId',
                roles: ["Mentee"]
            },
            {
                id: 'gameview',
                title: 'Game View',
                type: 'basic',
                link: '/exam-management/game-view/:examId',
                roles: ["Mentee"]
            },
            {
                id: 'game-analytics',
                title: 'game-analytics',
                type: 'basic',
                link: '/exam-management/game-analytics/:examId',
                roles: ["Mentee"]
            },
            {
                id: 'game-analytics',
                title: 'game-analytics',
                type: 'basic',
                link: '/exam-management/game-full-analytics/:examId',
                roles: ["Mentee"]
            },
            {
                id: 'game-analytics',
                title: 'game-analytics',
                type: 'basic',
                link: '/exam-management/game-reviews/:examId/:Questionid',
                roles: ["Mentee"]
            },
            {
                id: 'game-analytics',
                title: 'game-analytics',
                type: 'basic',
                link: '/exam-management/game-review/:examId',
                roles: ["Mentee"]
            },
            {
                id: 'game-analytics',
                title: 'game-analytics',
                type: 'basic',
                link: '/exam-management/exam-leaderboard/:examId',
                roles: ["Mentee"]
            },
            {
                id: 'courselist',
                title: 'courselist',
                type: 'basic',

                link: '/course/list/course-list',
                roles: ['Mentee']
            },
            {
                id: 'grandtest',
                title: 'Grand Test',
                type: 'basic',
                link: '/exam-management/list/leaderboard/:categoryname/:examtype',
                roles: ["Mentee"]
            },
            {
                id: 'subjects',
                title: 'subjects',
                type: 'basic',
                link: '/exam-management/list/leaderboard/:categoryname/:examtype/subject/:subjectname',
                roles: ["Mentee"]
            },
            {
                id: 'className',
                title: 'className',
                type: 'basic',
                link: '/exam-management/list/leaderboard/:categoryname/:examtype/:className',
                roles: ["Mentee"]
            },
            {
                id: 'className',
                title: 'className',
                type: 'basic',
                link: '/exam-management/list/leaderboard/:categoryname/:examtype/:className/:examType',
                roles: ["Mentee"]
            },
            {
                id: 'className',
                title: 'className',
                type: 'basic',
                link: '/exam-management/list/leaderboard/:categoryname/:examtype/exam-list/:className',
                roles: ["Mentee"]
            },
            {
                id: 'className',
                title: 'className',
                type: 'basic',
                link: '/exam-management/list/leaderboard/:categoryname/:examtype/:sessionName',
                roles: ["Mentee"]
            },
            {
                id: 'gameview',
                title: 'Game View',
                type: 'basic',
                link: '/exam-management/leaderboard-gameview/:examid',
                roles: ["Mentee"]
            },
            {
                id: 'game-analytics',
                title: 'game-analytics',
                type: 'basic',
                link: '/exam-management/leaderboard-game-analytics/:examid',
                roles: ["Mentee"]
            },
            {
                id: 'game-analytics',
                title: 'game-analytics',
                type: 'basic',
                link: '/exam-management/leaderboard-game-reviews/:examid',
                roles: ["Mentee"]
            },

        ]

    },
    {
        id   : 'qbank-details',
        title: 'qbank-details',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/qbanks/exam-details/:examId',
        roles : ['Mentee']
    },
    {
        id   : 'qbank-details',
        title: 'qbank-details',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/qbanks/game-view/:examId',
        roles : ['Mentee']
    },
    {
        id   : 'qbank-details',
        title: 'qbank-details',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/qbanks/game-review/:examId',
        roles : ['Mentee']
    },
    {
        id   : 'qbank-details',
        title: 'qbank-details',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/qbanks/game-analytics/:examId',
        roles : ['Mentee']
    },
    {
        id: 'qbank',
        title: 'Qbank',
        type: 'basic',
        link: '/qbanks/bookmarks',
        roles: ["Mentee", 'Admin']

    },
    {
        id: 'qbank',
        title: 'Qbank',
        type: 'basic',
        link: '/qbanks/bookmarks/questions/:subjectId',
        roles: ["Mentee", 'Admin']

    },
    {
        id: 'qbank',
        title: 'Qbank',
        type: 'basic',
        link: '/qbanks/bookmarks/questionsDetails/:subjectId/:Questionid',
        roles: ["Mentee", 'Admin']

    },
    {
        id: 'CustomQbank',
        title: 'Custom Qbank',
        type: 'basic',
        link: '/CustomQbank',
        roles: ["Mentee"]
    },
    {
        id: 'CustomQbank',
        title: 'Custom Qbank',
        type: 'basic',
        link: '/CustomQbank/Create',
        roles: ["Mentee"]
    },
    {
        id: 'CustomQbank',
        title: 'Custom Qbank',
        type: 'basic',

        link: '/CustomQbank/list',
        roles: ["Mentee"]

    },
    {
        id: 'CustomQbank',
        title: 'Custom Qbank',
        type: 'basic',

        link: '/CustomQbank/:examid',
        roles: ["Mentee"]

    },
    {
        id: 'customgameview',
        title: 'custom-game-view',
        type: 'basic',

        link: '/CustomQbank/custom-game-view',
        roles: ["Mentee"]

    },
    {
        id: 'gameview',
        title: 'game-view',
        type: 'basic',

        link: '/CustomQbank/game-view/:examid',
        roles: ["Mentee"]

    },
    {
        id: 'gamereview',
        title: 'custom-game-review',
        type: 'basic',

        link: '/CustomQbank/game-review/:examid',
        roles: ["Mentee"]

    },
    {
        id: 'gameanalytics',
        title: 'game-analytics',
        type: 'basic',

        link: '/CustomQbank/game-analytics/:examid',
        roles: ["Mentee"]

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
    }
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
    },
    {
        id   : 'viewreport',
        title: 'View Report',
        type : 'basic',
        icon : 'heroicons_outline:chart-bar',
        link : '/student/view-report'
    },
    {
        id   : 'viewprogress',
        title: 'View Progress',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/student/view-progress'
    },
    {
        id   : 'chat',
        title: 'Chat',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/chat',
        roles : ['Mentor']
    },
];
export const MenteeNavigation: FuseNavigationItem[] = [
    {
        id   : 'Dashboard',
        title: 'Dashboard',
        type : 'basic',
        icon : 'heroicons_outline:cube',
        link : '/dashboard'
    },
    {
        id   : 'qbank-list',
        title: 'QBank',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/qbanks/subjects',
        roles : ['Mentee']
    },
    {
        id: 'exams management',
        title: 'Exams',
        type: 'collapsable',
        icon : 'heroicons_outline:clipboard-document-list',
        children: []
    },    
];
export const MenteeCourseNavigation: FuseNavigationItem[] = [
    // {
    //     id   : 'student',
    //     title: 'Student',
    //     type : 'basic',
    //     icon : 'heroicons_outline:chart-pie',
    //     link : '/student'
    // }
    {
        id   : 'Dashboard',
        title: 'Dashboard',
        type : 'basic',
        icon : 'heroicons_outline:cube',
        link : '/dashboard'
    },
    {
        id   : 'task-list',
        title: 'Task List',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/task/list'
    },
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
