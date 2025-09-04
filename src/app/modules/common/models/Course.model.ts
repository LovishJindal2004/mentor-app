export class Courses {
    courseID: number;
    title: string;
    subTitle: string;
    description: string;
    id: string;
    rewardsPoint: number;
    startDate: string;
    endDate: string
    price: number
    videoID: number;
    hipposID: number;
    noteID: number;
    isBoomarked: boolean;
    todoID: number;
    liveSessionID: number;
    noOfQuestions: number;
    totalScore: number;
    totalMinutes: number;
    isActive: number;
    isDeleted: number;
    createdOn: string;
    updatedOn: string;
    updatedBy: string;
    constructor(course) {
        this.courseID = course.courseID;
        this.title = course.title;
        this.subTitle = course.subTitle;
        this.description = course.description
        this.rewardsPoint = course;
        this.startDate = course.rewardsPoint;
        this.endDate = course.endDate
        this.price = course.price
        this.videoID = course.videoID;
        this.hipposID = course.hipposID;
        this.noteID = course.noteID;
        this.isBoomarked = course.isBoomarked;
        this.todoID = course.todoID;
        this.liveSessionID = course.liveSessionID;
        this.noOfQuestions = course.noOfQuestions;
        this.totalScore = course.totalScore;
        this.totalMinutes = course.totalMinutes;
        this.isActive = course.isActive;
        this.isDeleted = course.isDeleted;
        this.createdOn = course.createdOn;
        this.updatedOn = course.updatedOn;
        this.updatedBy = course.updatedBy;
    }
}
export class Subject {
    backgroundUrl:string;
    guid: string;
    isBookMarked: boolean;
    maximumMarks: number;
    noOfDocument: number;
    noOfHours: number;
    noOfQuestions: number;
    noOfVideos: number;
    noOfViews: number;
    qbankTypeID: number;
    subjectID: number;
    subjectName: string;
}


export class hippoList {
    noOfpages: number;
    hippoTitle: string;
    isBookmar: boolean;
}

export class CourseOverview {
    maxNoOfQuestionAskForQuestion: number;
    maxMarksForSubject: number;
    subjectName: string;
    TeacherDetails: Array<teacherDetails>
}

export class teacherDetails {
    Image: string;
    TeacherName: string;
    teacherRole: string;
    Description: string;
    LessionName: string;
}
export class gameCourse {
    CourseID: number;
    Title: string;
    SubTitle: string;
    Description: string;
    Price: number;
    RewardsPoint: number;
    StartDate: string;
    EndDate: string;
    VideoID: number;
    HipposID: number;
    NoteID: number;
    TodoID: number;
    LiveSessionID: number;
    IsHide: boolean;
    IsActive: boolean;
    ExamID: Array<any>;
    NoOfExams: number;
    ProgressPercentage: number;
    NoOfEntrolled: number;
    NoOfQuestions: number;
    NoOfExamCompleted: number;
    TotalMinutes: number;
    TotalScore: number;
    NoOfTodos: number;

    Users: Array<any>;
    Subscription: any;


    /**
     * Constructor
     *
     * @param course
     */
    constructor(gameCourse) {
        {
            this.CourseID = gameCourse.gameCourseID; //|| UnisunUtils.generateGUID();
            this.Title = gameCourse.Title || '';
            this.SubTitle = gameCourse.SubTitle || '';
            this.Description = gameCourse.Description || '';
            this.Price = gameCourse.Price || '';
            this.RewardsPoint = gameCourse.RewardsPoint || '';
            this.StartDate = gameCourse.StartDate || '';
            this.EndDate = gameCourse.EndDate || '';
            this.VideoID = gameCourse.VideoID || 0;
            this.HipposID = gameCourse.HipposID || 0;
            this.NoteID = gameCourse.NoteID || 0;
            this.TodoID = gameCourse.TodoID || 0;
            this.LiveSessionID = gameCourse.LiveSessionID || 0;
            this.ExamID = gameCourse.ExamID || new Array<any>();
            this.Users = gameCourse.Users || new Array<any>();
            this.Subscription = gameCourse.Subscription;
        }
    }
}