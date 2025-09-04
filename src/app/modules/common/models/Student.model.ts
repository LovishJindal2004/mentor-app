export class StudentList {
    firstName: string;
    lastName: string;
    course: string;
    courses:Array<courses>
    imageUrl: string;
    rollNo: string;
    averageMarks: number;
    noOfExamsAssigned: string;
    noOfExamsAdmitted: string;
    noOfAwards: string;
    phoneNumber: string;
    email: string;
    id: string;
    userID: string;
    isActive: true;
    isDeleted: false;
    updatedBy: string;
    createdBy: string;
    createdOn: string;
    updatedOn: string;
    constructor(studentList) {
        this.id = studentList.StudentID;
        this.imageUrl = studentList.StudentImage;
        this.firstName = studentList.FirstName;
        this.lastName = studentList.LastName;
        this.course = studentList.CourseYear;
        this.rollNo = studentList.RollNo;
        this.isActive = studentList.IsActive;
        this.averageMarks = studentList.AverageCount;
        this.noOfExamsAssigned = studentList.ExamCount;
        this.noOfAwards = studentList.AwardsCount;
        this.phoneNumber = studentList.MobileNumber;
        this.email = studentList.Email;
    }

}
export class courses{
    courseID: number;
    title: string;
    subTitle: string;
    description: string
    rewardsPoint: number;
    startDate: string;
    endDate: string
    price: number
    videoID: number;
    hipposID: number;
    noteID: number;
    isBookmark:boolean;
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
        this.isBookmark=course.isBookmar|| false;
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
// export class EditSudent {
//     StudentID: number;
//     StudentImage: string;
//     StudentName: string;
//     CourseYear: string;
//     RollNo: string;
//     IsActive: boolean;
//     MobileNumber: string;
//     Email: string;
//     constructor(editSudent) {
//         this.StudentID = editSudent.StudentID || 0;
//         this.StudentImage = editSudent.StudentImage || '';
//         this.StudentName = editSudent.StudentName || '';
//         this.CourseYear = editSudent.CourseYear || '';
//         this.RollNo = editSudent.RollNo || '';
//         this.IsActive = editSudent.IsActive || false;
//         this.MobileNumber = editSudent.MobileNumber || '';
//         this.Email = editSudent.Email || '';
//     }

// }

export class StudentReportCard {
    StudentDetail: Array<StudentList>;
    SubjectWiseScore: any;
    ExamList: Array<ExamList>;
    constructor(studentReportCard) {
        this.StudentDetail = studentReportCard.StudentDetail;
        this.SubjectWiseScore = studentReportCard.SubjectWiseScore;
        this.ExamList = studentReportCard.ExamList;

    }
}
export class ExamList {
    ExamDate: string;
    ExamName: string;
    Subject: string;
    Rank: number;
    Percentage: string;
    ResultStatus: string;
    constructor(examList) {
        this.ExamDate = examList.ExamDate;
        this.ExamName = examList.ExamName;
        this.Subject = examList.Subject;
        this.Rank = examList.examList;
        this.Percentage = examList.Percentage;
        this.ResultStatus = examList.ResultStatus;
    }
}
export class Subjects {
    id: string;
    userID: string;
    isActive: boolean;
    isDeleted: boolean;
    updatedBy: string;
    createdBy: string;
    createdOn: string;
    updatedOn: string;
    subjectID: number;
    subjectName: string;
    description: string;
    backgroundUrl: string;
    backgroundColor: string;
    orderNo: number;
    qbankTypeID: number;
    noOfQuestions: number;
}
export class QBankTypes {
    title: string;
    id: 0;
    subjects: Array<Subjects>;

}

export class StudentProfile{
    id: string
    firstName: string
    lastName: string
    phoneNumber: string
    email:string;
      image:any;
    phoneCountryCode: string
    courseType: string
    collegeId: string
    medicalCourseYear: number
    year: number
    birthDate: string
    currentStateId: string
    cityId: string
    stateId: string
    gender: number
    roleName: string
    currentRoleName: string

}