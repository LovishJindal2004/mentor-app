export class VideoCollection {
    noOfQuestions: number;
    noOfCompletedQuestion: number;

    topic: string;
    videos: Array<VideoDetails>
}
export class VideoDetails {
    guid: string;
    id: number;
    status: number;
    isBoomarked: boolean;
    maxViewPermission: number;
    notesLink: any;
    price: number;
    queueID: number;
    refVideoID: number;
    subject: string;
    title: string;
    url: string;
    videoLength: string;
    videoType: string;

    /**
     * Constructor
     *
     * @param VideoDetails
     */
    constructor(value) {
        {
            this.guid = value.guid;
            this.id = value.id;
            this.isBoomarked = value.isBoomarked;
            this.maxViewPermission = value.maxViewPermission;
            this.notesLink = value.notesLink;
            this.price = value.price;
            this.queueID = value.queueID;
            this.refVideoID = value.refVideoID;
            this.subject = value.subject;
            this.title = value.title;
            this.url = value.url;
            this.videoLength = value.videoLength;
            this.videoType = value.videoType;

        }
    }
}

export class parts{
 description: string;
  name: string;
  noAnsweredMarkedForReview: number;
  noNotAnswered: number;
  noNotVisited: number;
  noOfCalculatedReisk: number;
  noOfCorrect: number;
  noOfInCorrect: number;
  noOfMarkedReview: number;
  noOfUnAttempt: number;
  partId: number;
  questions:Array<QuestionReponse>
}

export class partswiseexam{
    description: string;
    name: string;
    noAnsweredMarkedForReview: number;
    noNotAnswered: number;
    noNotVisited: number;
    noOfCalculatedReisk: number;
    noOfCorrect: number;
    noOfInCorrect: number;
    noOfMarkedReview: number;
    noOfUnAttempt: number;
    partId: number;
    isSubmitted:boolean
    duration:number
    testDuration:number
    questions:Array<QuestionReponse>
   }

export class QuestionReponse {
    choices: Array<choices>;
    content: string;
    createdOn: string;
    questionDetailID: string;
    guid: any;
    partId:number;
    isActive: boolean;
    isChecked: boolean;
    isMarkedReview: boolean;
    isCalculateRisk: boolean;
    isCorrect: boolean;
    isDeleted: boolean;
    unAttempt: boolean;
    questionTitle: string;
    questionType: number;
    isBookMarked: boolean
    questionBankID: string;
    

}
export class QuestionActivaty {
    activityId: string;
    duration: any;
    testDuration: any;
    constructor(questionActivaty) {
        this.activityId = questionActivaty.activityId;
        this.duration = questionActivaty.duration;
        this.testDuration = questionActivaty.testDuration;
    }
}
export class choices {
    questionSetID: number | null;
    questionDetailID: number;
    choiceId: number;
    choiceText: string;
    isCorrect: boolean;
    validAdditionalValue: any | null;
    matchedValue: any | null;
    additionalChoice: any | null;
    isChecked: boolean | null;
    pollPercentage: number;
    pollCount: number;
}
export class BookMark {
    cmbeCodeId: number;
    questionId: number;
    isBookMark: boolean;
}

export class Examlisting {
    examstatus: number;
    guid: string;
    id: number;
    testType: any;
    title: string;
    year: number
}