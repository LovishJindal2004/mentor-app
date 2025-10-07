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
export class QuestionActivaty {
    activityId: string;
    examDuration: any;
    duration: number;
    constructor(questionActivaty) {
        this.activityId = questionActivaty.activityId;
        this.examDuration = questionActivaty.examDuration;
        this.duration = questionActivaty.duration;
    }
}
export class customExam {
    examId: string;
    startTime: number; // Updated to lowercase "number"
    endTime: number;   // Updated to lowercase "number"
    isExamManully: boolean;

    constructor(customExam) {
        this.examId = customExam.examId;
        this.startTime = customExam.startTime;
        this.endTime = customExam.endTime;
        this.isExamManully = customExam.isExamManully;
    }
}
export class CustomQbankMcq {
    mcqCode: string;
    noOfQuestions: number;
    levelId?: number;
    mcqCategory: Array<any>;
    examDuration?: number;
    customizeTime?: string;
    examMode: number;

    subjects: Array<any>;
    topics: Array<any>;
    name: string;
    tags: Array<any>;
    // plannerDate: string;
    constructor(customQbankMcq) {
        this.mcqCode = customQbankMcq.mcqCode
        this.noOfQuestions = customQbankMcq.noOfQuestions
        this.levelId = customQbankMcq.levelId
        this.mcqCategory = customQbankMcq.mcqCategory
        this.examDuration = customQbankMcq.examDuration
        this.customizeTime = customQbankMcq.customizeTime
        this.examMode = customQbankMcq.examMode

        this.subjects = customQbankMcq.subjects
        this.topics = customQbankMcq.topics
        this.name = customQbankMcq.name
        this.tags = customQbankMcq.tags
        // this.plannerDate = customQbankMcq.plannerDate
    }
}