
export class CourseUserPermission {
    UserName: string;
    UserID: number;
    Mobile: string;
    Email: string;

    /**
     * Constructor
     *
     * @param course
     */
    constructor(course) {
        {
            this.UserName = course.UserName; //|| UnisunUtils.generateGUID();
            this.UserID = course.UserID || '';
            this.Mobile = course.Mobile || '';
            this.Email = course.Email || '';
        }
    }
}