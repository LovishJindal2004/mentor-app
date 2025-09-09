export class QuestionReponse {
    choices: Array<choices>;
    cmbeCode: any;
    cmbeDescription: any;
    cmbeid: number;
    cqbankQuestionStatus: number;
    createdOn: string;
    explanation: any;
    explanations: any[];
    horizontalIntegration: any[];
    isDeleted: boolean;
    level: any;
    levelID: number;
    levelIDOfQuestion: number;
    notes: string;
    qbankType: any;
    qbankTypeID: number;
    questionDetailID: number;
    questionLevel: any;
    questionTitle: string;
    questionType: number;
    selectedHorizontalIntegration: any;
    selectedTags: any;
    selectedVerticalIntegration: any;
    subject: any;
    subjectID: number;
    tags: any[];
    topic: any;
    topicID: number;
    updatedON: string;
    isMarkedReview:boolean;
    isCalculateRisk:boolean;
    userID: number;
    verticalIntegration: any[];
    videos: any[];
    isChecked: boolean;
    isCorrect: boolean;
    isBoomarked:boolean;
    unAttempt:boolean;
    duration:number;
}
export class QuestionActivaty {
    activityId: string;
    examDuration: any;
    constructor(questionActivaty) {
        this.activityId = questionActivaty.activityId;
        this.examDuration = questionActivaty.examDuration;
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
    noOfUsersSelectedThisOption:number;
}
export class BookMark {
    cmbeCodeId: number;
    questionId: number;
    isBookMark: boolean;
}

export class QbankSubject{
    subjectId:number;
    noOfQuestions:number;
    subjectImage:string;
    subjectName:string;
    totalNoOfCompletedModules:0
    totalNoOfModules:1
    constructor(values){
        this.subjectId=values.subjectId || 0;
        this.noOfQuestions=values.noOfQuestions || 0;
        this.subjectImage=values.subjectImage || '';
        this.subjectName=values.subjectName || '';
        this.totalNoOfCompletedModules=values.totalNoOfCompletedModules || 0;
        this.totalNoOfModules=values.totalNoOfModules || 0;
    }
}