export class CreateQuestion{
    userID:any;
    questionDetailID:number;
    qbankTypeID: number;
    subjectID: number;
    topicID: number;
    questionType: string;
    questionTitle: string;  
    questionLevel:string;
    level:string;
    verticalIntegration:Array<any>;
    horizontalIntegration:Array<any>;
    choices: Array<Choices>
    notes:string;
    explanation:string;
    books:Array<any>;
    videos:Array<any>;
    explanations:Array<any>;
    tags:Array<any>;

    // Explanation: any;

}
export class Choices {
    
    choiceID: Number;
    choiceText: string;
    isCorrect: boolean;
    questionDetailID: Number
    QueueID: number;
    constructor(choiceID: Number, choiceText: string, isCorrect: boolean, questionDetailID: Number) {
        this.choiceID = choiceID;
        this.choiceText = choiceText;
        this.isCorrect = isCorrect;
        this.questionDetailID = questionDetailID;
    }
}

export class QuestionListFilter{
    Search: string;
    pageNumber: number;
    pageSize: number;
    orderBy: string;
    sortOrder: string;
    userId: string;
    status: number;
    tagIds: Array<number>;
    qBankTypeId: Array<number>;
    levelOfQuestionID: number;
    levelId: number;
    qBankCategoryId: string;
    subjectIds:Array<number>;
    topicIds:Array<number>;
    cmbeCodeIds:Array<number>;

}
export class QuestionListModel {
    BooksName:string;
    BookEdition:string;
    PageNumber:number;
    Question:string;
    CMBECode: string;
    CMBEDescription:string;
    // CQBANKQuestionStatus: number;
    Choices: Array<Choices>
    Correct:string;
    Pattern:string;
    VerticalIntegration:Array<any>;
    HorizontalIntegration:Array<any>;
    Explanations: Array<Explanations>;
    CompentencyLevel:string;
    LevelofQuestions:string;
    QBankType: string;
    QuestionBankID: number;
    // QuestionType: number;
    Explanation: string;
    Notes: string;
    Subject: string;
    userId: string;
    Tags: Array<Tags>
    Topic: string;
    Video: Array<Videos>
    
    constructor(questionListModel) {

        this.CMBECode = questionListModel.CMBECode;
        // this.CQBANKQuestionStatus = questionListModel.CQBANKQuestionStatus;
        this.Explanations = questionListModel.Explanations;
        this.VerticalIntegration = questionListModel.VerticalIntegration;
        this.HorizontalIntegration = questionListModel.HorizontalIntegration;
        this.QBankType = questionListModel.QbankType;
        this.QuestionBankID = questionListModel.QuestionDetailID;
        // this.QuestionType = questionListModel.QuestionType;
        this.Explanation = questionListModel.Explanation||'';
        this.Notes = questionListModel.Notes||'';
        this.Subject = questionListModel.Subject;
        this.Topic = questionListModel.Topic;
    }
}
export class Explanations {
    Content: string;
    ExplanationID: number;
    QueueID: number;
    constructor(explanations) {
        this.Content = explanations.Content;
        this.ExplanationID = explanations.ExplanationID;
    }
}
export class Tags {
    CanAccess: boolean;
    CreatedBy: string;
    CreatedOn: number;
    Email: string;
    IsActive: boolean
    IsDeleted: boolean
    IsHide: boolean
    name: string;
    OrderNo: number
    tagID: number
    UpdatedBy: string;
    UpdatedOn: number;
    UserID: number
    constructor(tags) {
        this.CanAccess = tags.CanAccess;
        this.CreatedBy = tags.CreatedBy;
        this.CreatedOn = tags.CreatedOn;
        this.Email = tags.Email;
        this.IsActive = tags.IsActive;
        this.IsDeleted = tags.IsDeleted;
        this.IsHide = tags.IsHide;
        this.name = tags.name;
        this.OrderNo = tags.OrderNo;
        this.tagID = tags.tagID;
        this.UpdatedBy = tags.UpdatedBy;
        this.UpdatedOn = tags.UpdatedOn;
        this.UserID = tags.UserID;
    }
}
export class Videos {
    VideoID: number;
    VideoLink: string;
    QueueID: number;
    constructor(video) {
        this.VideoID = video.VideoID;
        this.VideoLink = video.VideoLink;
    }
}
export class CompetenecyLevel  {
    levelID: number;
    title: string;
    orderNo: number;
    constructor(competenecyLevel) {
        {
        this.levelID=competenecyLevel.levelID;
        this.title=competenecyLevel.title;
        this.orderNo=competenecyLevel.orderNo


        }
    }
}
export class LevelQuestion  {
    levelID: number;
    title: string;
    orderNo: number;

    constructor(levelQuestion) {
        {
        this.levelID=levelQuestion.levelID;
        this.title=levelQuestion.title;
        this.orderNo=levelQuestion.orderNo


        }
    }
}
export class Tag {
    Name: string;
    TagID: number;
    IsActive: boolean;
    orderNo: number;
    Modules: Array<Module> //sandeep kumar 02/01/2023 modules add start and end

    /**
     * Constructor
     *
     * @param subject
     */
    constructor(tag) {
        {
            this.TagID = tag.TagID; //|| UnisunUtils.generateGUID();
            this.Name = tag.SubjectName || '';
            this.Modules = tag.Modules || '';

        }
    }
}
export class Module {
    ModuleID: number;
    Name: string;
    isSelected: boolean;
}