import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio'; // Add this import
import { AssignStudentComponent } from '../assign-student/assign-student.component';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { StudentService } from '../../student-management/student.service';
import { helperService } from 'app/core/auth/helper';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
// Remove MatCheckboxModule import
import { CommanService } from 'app/modules/common/services/common.service';
import { TaskService } from '../task.service';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-assign-task',
  imports: [
    MatSelectModule, 
    MatDatepickerModule, 
    MatIconModule, 
    MatTableModule, 
    MatRadioModule, // Add this instead of MatCheckboxModule
    MatPaginatorModule, 
    MatInputModule, 
    MatFormFieldModule, 
    FormsModule, 
    CommonModule, 
    MatButtonModule, 
    ReactiveFormsModule,
    MatChipsModule
  ],
  templateUrl: './assign-task.component.html',
  styleUrl: './assign-task.component.scss'
})
export class AssignTaskComponent implements OnInit {
  assignTaskForm!: FormGroup;
  examTypes: any;
  topics: any;
  qbankExams: any;
  testExamsByType:any;
  minDate: Date = new Date();
  dialogRef: any;
  userDetails: any;
  studentList: any[] = [];
  totalStudents = 0;
  pageSize = 10;
  pageNumber = 1;
  videoSubjects: any;
  videosByTopic: any;
  subjects: any;
  selectedStudent: any = null; // Changed from selectedStudents array to single student
  isSubmitting = false;

  @ViewChild('studentPopup') studentPopup!: TemplateRef<any>;
  taskGuid: string;
  taskDetails: any;

  constructor(
    private fb: FormBuilder,
    private _matDialog: MatDialog,
    private _route: ActivatedRoute,
    private _router: Router,
    private _studentService: StudentService,
    private _commanService: CommanService,
    private _taskService: TaskService,
    private _helperService: helperService
  ) {
    this.userDetails = this._helperService.getUserDetail();
    this._route.params.subscribe(res=>{
      this.taskGuid = res?.guid
    })
    if(this.taskGuid){
      this._taskService.getTask(this.taskGuid).then(res=>{
        this.taskDetails = res;
        this.assignTaskForm.patchValue({
          title: this.taskDetails?.title,
          description: this.taskDetails?.description,
          date: this.taskDetails?.date,
          module: this.taskDetails?.modules,
          videoSubjects: this.taskDetails?.videoSubjects,
          videos: this.taskDetails?.videos,
          qbankSubjects: this.taskDetails?.qbankSubjects,
          qbankExams: this.taskDetails?.qbankExams,
          testExams: this.taskDetails?.testExams,
          student: this.taskDetails?.students.toString(), // Changed from students array to single student
        });
        // Set the selected student for edit mode
        if (this.taskDetails?.students) {
          console.log(this.studentList,"studentList")
          this.selectedStudent = this.studentList.find(s => s.id === this.taskDetails.students) || { id: this.taskDetails.students };
        }
      })
    }
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setupStudentChangeListener();
    this.loadStudents().then(() => {
      this.loadInitialData().then(() => {
        if (this.taskGuid) {
          this._taskService.getTask(this.taskGuid).then(res => {
            this.taskDetails = res;
            this.patchEditFormValues();
          });
        }
      });
    });
    this.assignTaskForm.get('examTypes')?.valueChanges.subscribe(types => {
      this.testExamsByType = [];
      if (types && types.length > 0) {
        types.forEach((type: any) => this.loadTestExamsForType(type.examType, type.name));
      }
      this.assignTaskForm.patchValue({ testExams: [] });
    });
    this.assignTaskForm.get('examTypes')?.valueChanges.subscribe(types => {
      this.testExamsByType = [];
      if (types && types.length > 0) {
        types.forEach((type: any) => this.loadTestExamsForType(type.examType, type.name));
      }
      this.assignTaskForm.patchValue({ testExams: [] });
    });
  }
  private setupStudentChangeListener(): void {
    this.assignTaskForm.get('student')?.valueChanges.subscribe(student => {
      if (student && student.id) {
        this.refreshStudentSpecificData();
      }
    });
  }
  
  private refreshStudentSpecificData(): void {
    const currentModule = this.assignTaskForm.get('module')?.value;
    
    // Clear existing data
    this.videosByTopic = [];
    this.qbankExams = [];
    this.testExamsByType = [];
    
    // Clear form selections for student-specific data
    this.assignTaskForm.patchValue({
      videos: [],
      qbankExams: [],
      testExams: []
    });
  
    // Reload data based on current selections
    if (currentModule === 'Video') {
      this.refreshVideoData();
    } else if (currentModule === 'QBank') {
      this.refreshQBankData();
    } else if (currentModule === 'Test') {
      this.refreshTestData();
    }
  }
  
  private refreshVideoData(): void {
    const selectedVideoSubjects = this.assignTaskForm.get('videoSubjects')?.value || [];
    selectedVideoSubjects.forEach((subject: any) => {
      this.loadVideosForSubject(subject.id);
    });
  }
  
  private refreshQBankData(): void {
    const selectedQbankSubjects = this.assignTaskForm.get('qbankSubjects')?.value || [];
    selectedQbankSubjects.forEach((subject: any) => {
      this.loadQBankExamsForSubject(subject.subjectId);
    });
  }
  
  private refreshTestData(): void {
    const selectedExamTypes = this.assignTaskForm.get('examTypes')?.value || [];
    selectedExamTypes.forEach((examType: any) => {
      this.loadTestExamsForType(examType.examType || examType.id, examType.name);
    });
  }

  private mapIdsToObjects(ids: number[], source: any[], idKey: string = 'id'): any[] {
    if (!ids?.length || !source?.length) return [];
    return source.filter(item => ids.includes(item[idKey]));
  }

  private findExamsByIds(ids: number[], groups: any[], examKey: string = 'id'): any[] {
    const result: any[] = [];
    if (!ids?.length || !groups?.length) return [];
    groups.forEach(group => {
      const exams = group.exams || group.videos || [];
      ids.forEach(id => {
        const examObj = exams.find((e: any) => e[examKey] === id);
        if (examObj) result.push(examObj);
      });
    });
    return result;
  }
  
  private async patchEditFormValues(): Promise<void> {
    const td = this.taskDetails;

    // Map single student object instead of array
    const mappedStudent = this.studentList.find(s => s.id == td?.students[0]) || null;
    const mappedQbankSubjects = this.mapIdsToObjects(td?.qbankSubjects, this.subjects, 'subjectId');
    const mappedVideoSubjects = this.mapIdsToObjects(td?.videoSubjects, this.videoSubjects, 'id');
    const mappedExamTypes = this.mapIdsToObjects(td?.examTypes, this.examTypes, 'id');

    this.assignTaskForm.patchValue({
      title: td?.title,
      description: td?.description,
      date: td?.date,
      module: td?.modules,
      student: mappedStudent, // Changed from students array to single student
      qbankSubjects: mappedQbankSubjects,
      videoSubjects: mappedVideoSubjects,
      examTypes: mappedExamTypes,
      qbankExams: [],
      testExams: [],
      videos: []
    });

    // Set selectedStudent for UI
    this.selectedStudent = mappedStudent;

    // Load dependent data
    const videoLoads = (mappedVideoSubjects || []).map((s: any) => this.loadVideosForSubject(s.id));
    const qbankExamLoads = (mappedQbankSubjects || []).map((s: any) => this.loadQBankExamsForSubject(s.subjectId));
    const testExamLoads = (mappedExamTypes || []).map((examType: any) => 
      this.loadTestExamsForType(examType.examType || examType.id, examType.name)
    );

    await Promise.all([...videoLoads, ...qbankExamLoads, ...testExamLoads]);

    const selectedVideos = this.findItemsByIds(td?.videos, this.videosByTopic, 'id', 'videos');
    const selectedQbankExams = this.findItemsByIds(td?.qbankExams, this.qbankExams, 'id', 'exams');
    const selectedTestExams = this.mapIdsToObjects(td?.testExams, this.testExamsByType, 'id');

    this.assignTaskForm.patchValue({
      videos: selectedVideos,
      qbankExams: selectedQbankExams,
      testExams: selectedTestExams
    });
  }

  private findItemsByIds(ids: number[], groups: any[], itemKey: string = 'id', groupKey: string = 'exams'): any[] {
    if (!ids?.length || !groups?.length) return [];
    const items: any[] = [];
    groups.forEach(group => {
      const arr = group[groupKey] || [];
      arr.forEach(item => {
        if (ids.includes(item[itemKey])) {
          items.push(item);
        }
      });
    });
    return items;
  }

  private initializeForm(): void {
    this.assignTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: [null, Validators.required],
      module: ['Video', Validators.required],
      
      videoSubjects: [[]],
      videos: [[]],
      
      qbankSubjects: [[]],
      qbankExams: [[]],
      
      examTypes: [[]],
      testExams: [[]],
      
      // Changed from students array to single student
      student: [null, Validators.required]
    });

    this.assignTaskForm.get('module')?.valueChanges.subscribe(module => {
      this.updateModuleValidators(module);
    });

    this.updateModuleValidators(this.assignTaskForm.get('module')?.value);
  }

  async loadInitialData(): Promise<void> {
    try {
      const [subjects, examTypes, videoSubjects] = await Promise.all([
        this._taskService.getQBankSubjects(),
        this._taskService.getTestExamTypes(),
        this._taskService.getVideoSubjects()
      ]);
      this.subjects = subjects;
      this.examTypes = examTypes;
      this.videoSubjects = videoSubjects;
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  }

  updateModuleValidators(module: string): void {
    const videoControls = ['videoSubjects', 'videos'];
    const qbankControls = ['qbankSubjects', 'qbankExams'];
    const testControls = ['examTypes', 'testExams'];
    const allConditionalControls = [...videoControls, ...qbankControls, ...testControls];

    allConditionalControls.forEach(controlName => {
      const control = this.assignTaskForm.get(controlName);
      if (control) {
        control.clearValidators();
        control.markAsUntouched();
        control.markAsPristine();
        control.setErrors(null);
      }
    });

    if (module === 'Video') {
      this.assignTaskForm.get('videoSubjects')?.setValidators([Validators.required, this.arrayNotEmptyValidator]);
      this.assignTaskForm.get('videos')?.setValidators([Validators.required, this.arrayNotEmptyValidator]);
    }
    
    if (module === 'QBank') {
      this.assignTaskForm.get('qbankSubjects')?.setValidators([Validators.required, this.arrayNotEmptyValidator]);
      this.assignTaskForm.get('qbankExams')?.setValidators([Validators.required, this.arrayNotEmptyValidator]);
    }
    
    if (module === 'Test') {
      this.assignTaskForm.get('examTypes')?.setValidators([Validators.required, this.arrayNotEmptyValidator]);
      this.assignTaskForm.get('testExams')?.setValidators([Validators.required, this.arrayNotEmptyValidator]);
    }

    allConditionalControls.forEach(controlName => {
      this.assignTaskForm.get(controlName)?.updateValueAndValidity({ emitEvent: false });
    });
  }

  arrayNotEmptyValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value && Array.isArray(control.value) && control.value.length > 0) {
      return null;
    }
    return { required: true };
  }

  getFormErrors(): any {
    const errors: any = {};
    Object.keys(this.assignTaskForm.controls).forEach(key => {
      const control = this.assignTaskForm.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  async loadStudents(): Promise<void> {
    const req = {
      keyword: '',
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      orderBy: '',
      sortOrder: ''
    };
    await this._studentService.getAssignedStudentList(req, this.userDetails?.Id)
      .then((res: any) => {
        this.studentList = res?.data || [];
        this.totalStudents = res?.totalCount || 0;
      })
      .catch(error => {
        console.error('Error loading students:', error);
        this.studentList = [];
        this.totalStudents = 0;
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadStudents();
  }

  // === UPDATED STUDENT SELECTION METHODS FOR SINGLE SELECTION ===
  isStudentSelected(student: any): boolean {
    return this.selectedStudent && this.selectedStudent.id === student.id;
  }

  selectStudent(student: any): void {
    this.selectedStudent = student;
    this.assignTaskForm.patchValue({ student: student });
  }

  assignStudent(): void {
    this.dialogRef = this._matDialog.open(this.studentPopup, {
      width: '500px',
      panelClass: 'assign-students'
    });
  }

  saveSelectedStudent(): void {
    if (this.selectedStudent) {
      this.assignTaskForm.patchValue({ student: this.selectedStudent });
      this.dialogRef.close();
    }
  }
  

  // === EXISTING VIDEO MODULE METHODS (unchanged) ===
  selectVideoSubject(subject: any): void {
    const currentSubjects = this.assignTaskForm.get('videoSubjects')?.value || [];
    const subjectExists = currentSubjects.find((s: any) => s.id === subject.id);
    
    if (subjectExists) {
      const updatedSubjects = currentSubjects.filter((s: any) => s.id !== subject.id);
      this.assignTaskForm.patchValue({ videoSubjects: updatedSubjects });
      
      const currentVideos = this.assignTaskForm.get('videos')?.value || [];
      const updatedVideos = currentVideos.filter((video: any) => 
        updatedSubjects.some((s: any) => s.id === video.subjectId)
      );
      this.assignTaskForm.patchValue({ videos: updatedVideos });
    } else {
      this.assignTaskForm.patchValue({ 
        videoSubjects: [...currentSubjects, subject] 
      });
      this.loadVideosForSubject(subject.id);
    }
  }

  isVideoSubjectSelected(subject: any): boolean {
    const currentSubjects = this.assignTaskForm.get('videoSubjects')?.value || [];
    return currentSubjects.some((s: any) => s.id === subject.id);
  }

  removeVideoSubject(subject: any): void {
    const currentSubjects = this.assignTaskForm.get('videoSubjects')?.value || [];
    const updatedSubjects = currentSubjects.filter((s: any) => s.id !== subject.id);
    this.assignTaskForm.patchValue({ videoSubjects: updatedSubjects });
    
    const currentVideos = this.assignTaskForm.get('videos')?.value || [];
    const updatedVideos = currentVideos.filter((video: any) => 
      updatedSubjects.some((s: any) => s.id === video.subjectId)
    );
    this.assignTaskForm.patchValue({ videos: updatedVideos });
  }

  getSelectedVideoSubjects(): any[] {
    return this.assignTaskForm.get('videoSubjects')?.value || [];
  }

  async loadVideosForSubject(subjectId: string): Promise<void> {
    try {
      const res = await this._taskService.getVideos(this.assignTaskForm.get('student')?.value,subjectId);
      const existingVideos = this.videosByTopic || [];
      const newVideos: any = res || [];
      
      const videoMap = new Map();
      
      existingVideos.forEach((topic: any) => {
        videoMap.set(`${topic.topicName}_${topic.subjectId || subjectId}`, topic);
      });
      
      newVideos.forEach((topic: any) => {
        const topicWithSubject = { ...topic, subjectId };
        videoMap.set(`${topic.topicName}_${subjectId}`, topicWithSubject);
      });
      
      this.videosByTopic = Array.from(videoMap.values());
    } catch (error) {
      console.error('Error loading videos for subject:', error);
    }
  }

  selectVideo(video: any): void {
    const currentVideos = this.assignTaskForm.get('videos')?.value || [];
    const videoExists = currentVideos.find((v: any) => v.id === video.id);
    
    if (videoExists) {
      const updatedVideos = currentVideos.filter((v: any) => v.id !== video.id);
      this.assignTaskForm.patchValue({ videos: updatedVideos });
    } else {
      this.assignTaskForm.patchValue({ 
        videos: [...currentVideos, video] 
      });
    }
  }

  isVideoSelected(video: any): boolean {
    const currentVideos = this.assignTaskForm.get('videos')?.value || [];
    return currentVideos.some((v: any) => v.id === video.id);
  }

  removeVideo(video: any): void {
    const currentVideos = this.assignTaskForm.get('videos')?.value || [];
    const updatedVideos = currentVideos.filter((v: any) => v.id !== video.id);
    this.assignTaskForm.patchValue({ videos: updatedVideos });
  }

  getSelectedVideos(): any[] {
    return this.assignTaskForm.get('videos')?.value || [];
  }

  // === QBANK MODULE METHODS (unchanged) ===
  selectqbankSubject(subject: any): void {
    const currentSubjects = this.assignTaskForm.get('qbankSubjects')?.value || [];
    const subjectExists = currentSubjects.find((s: any) => s.subjectId === subject.subjectId);
    
    if (subjectExists) {
      const updatedSubjects = currentSubjects.filter((s: any) => s.subjectId !== subject.subjectId);
      this.assignTaskForm.patchValue({ qbankSubjects: updatedSubjects });
      
      const currentExams = this.assignTaskForm.get('qbankExams')?.value || [];
      const updatedExams = currentExams.filter((exam: any) => 
        updatedSubjects.some((s: any) => s.subjectId === exam.subjectId)
      );
      this.assignTaskForm.patchValue({ qbankExams: updatedExams });
    } else {
      this.assignTaskForm.patchValue({ 
        qbankSubjects: [...currentSubjects, subject] 
      });
      this.loadQBankExamsForSubject(subject.subjectId);
    }
  }

  isQbankSubjectSelected(subject: any): boolean {
    const currentSubjects = this.assignTaskForm.get('qbankSubjects')?.value || [];
    return currentSubjects.some((s: any) => s.subjectId === subject.subjectId);
  }

  // removeQbankSubject(subject: any): void {
  //   const currentSubjects = this.assignTaskForm.get('qbankSubjects')?.value || [];
  //   const updatedSubjects = currentSubjects.filter((s: any) => s.subjectId !== subject.subjectId);
  //   this.assignTaskForm.patchValue({ qbankSubjects: updatedSubjects });
    
  //   const currentExams = this.assignTaskForm.get('qbankExams')?.value || [];
  //   const updatedExams = currentExams.filter((exam: any) => 
  //     updatedSubjects.some((s: any) => s.subjectId === exam.subjectId)
  //   );
  //   this.assignTaskForm.patchValue({ qbankExams: updatedExams });
  // }
  removeQbankSubject(subject: any): void {
    const currentSubjects = this.assignTaskForm.get('qbankSubjects')?.value || [];
    const updatedSubjects = currentSubjects.filter((s: any) => s.subjectId !== subject.subjectId);
    this.assignTaskForm.patchValue({ qbankSubjects: updatedSubjects });
    
    const currentExams = this.assignTaskForm.get('qbankExams')?.value || [];
    const updatedExams = currentExams.filter((exam: any) => 
      updatedSubjects.some((s: any) => s.subjectId === exam.subjectId)
    );
    this.assignTaskForm.patchValue({ qbankExams: updatedExams });
    
    // ADD THIS LINE - it removes the topics from the displayed list
    this.qbankExams = (this.qbankExams || []).filter((topic: any) => topic.subjectId !== subject.subjectId);
  }

  getSelectedQbankSubjects(): any[] {
    return this.assignTaskForm.get('qbankSubjects')?.value || [];
  }

  // async loadQBankExamsForSubject(subjectId: string): Promise<void> {
  //   try {
  //     const res = await this._taskService.getQBankExams(this.assignTaskForm.get('student')?.value,subjectId);
  //     const existingExams = this.qbankExams || [];
  //     const newExams: any = res || [];
      
  //     const examMap = new Map();
      
  //     existingExams.forEach((topic: any) => {
  //       examMap.set(`${topic.topicName}_${topic.subjectId || subjectId}`, topic);
  //     });
      
  //     newExams.forEach((topic: any) => {
  //       const topicWithSubject = { ...topic, subjectId };
  //       examMap.set(`${topic.topicName}_${subjectId}`, topicWithSubject);
  //     });
      
  //     this.qbankExams = Array.from(examMap.values());
  //   } catch (error) {
  //     console.error('Error loading QBank exams:', error);
  //   }
  // }
  async loadQBankExamsForSubject(subjectId: string): Promise<void> {
    try {
      const res = await this._taskService.getQBankExams(this.assignTaskForm.get('student')?.value,subjectId);
      const existingExams = this.qbankExams || [];
      const newExams: any = res || [];
      
      const examMap = new Map();
      
      // Add new exams first (so they appear at the top)
      newExams.forEach((topic: any) => {
        const topicWithSubject = { ...topic, subjectId };
        examMap.set(`${topic.topicName}_${subjectId}`, topicWithSubject);
      });
      
      // Then add existing exams (they'll be skipped if already added above)
      existingExams.forEach((topic: any) => {
        const key = `${topic.topicName}_${topic.subjectId || subjectId}`;
        if (!examMap.has(key)) {
          examMap.set(key, topic);
        }
      });
      
      this.qbankExams = Array.from(examMap.values());
    } catch (error) {
      console.error('Error loading QBank exams:', error);
    }
  }

  selectqbankExam(exam: any): void {
    const currentExams = this.assignTaskForm.get('qbankExams')?.value || [];
    const getId = (x: any) => (x && (x.id ?? x.examId));
    const examExists = currentExams.some((e: any) => getId(e) === getId(exam));

    if (examExists) {
      const updatedExams = currentExams.filter((e: any) => getId(e) !== getId(exam));
      this.assignTaskForm.patchValue({ qbankExams: updatedExams });
    } else {
      this.assignTaskForm.patchValue({
        qbankExams: [...currentExams, exam]
      });
    }
  }

  isQbankExamSelected(exam: any): boolean {
    const currentExams = this.assignTaskForm.get('qbankExams')?.value || [];
    const getId = (x: any) => (x && (x.id ?? x.examId));
    return currentExams.some((e: any) => getId(e) === getId(exam));
  }

  removeQbankExam(exam: any): void {
    const currentExams = this.assignTaskForm.get('qbankExams')?.value || [];
    const getId = (x: any) => (x && (x.id ?? x.examId));
    const updatedExams = currentExams.filter((e: any) => getId(e) !== getId(exam));
    this.assignTaskForm.patchValue({ qbankExams: updatedExams });
  }

  getSelectedQbankExams(): any[] {
    return this.assignTaskForm.get('qbankExams')?.value || [];
  }

  // === TEST MODULE METHODS (unchanged) ===
  selectexamType(examType: any): void {
    const currentExamTypes = this.assignTaskForm.get('examTypes')?.value || [];
    const examTypeExists = currentExamTypes.some((et: any) => et.id === examType.id);
    
    if (examTypeExists) {
      const updatedExamTypes = currentExamTypes.filter((et: any) => et.id !== examType.id);
      this.assignTaskForm.patchValue({ examTypes: updatedExamTypes });
    } else {
      this.assignTaskForm.patchValue({ 
        examTypes: [...currentExamTypes, examType] 
      });
    }
  }

  isExamTypeSelected(examType: any): boolean {
    const currentExamTypes = this.assignTaskForm.get('examTypes')?.value || [];
    return currentExamTypes.some((et: any) => et.id === examType.id);
  }

  removeExamType(examType: any): void {
    const currentExamTypes = this.assignTaskForm.get('examTypes')?.value || [];
    const updatedExamTypes = currentExamTypes.filter((et: any) => et.id !== examType.id);
    this.assignTaskForm.patchValue({ examTypes: updatedExamTypes });
  }

  getSelectedExamTypes(): any[] {
    return this.assignTaskForm.get('examTypes')?.value || [];
  }

  removeTestExam(testExam: string): void {
    const currentTestExams = this.assignTaskForm.get('testExams')?.value || [];
    const updatedTestExams = currentTestExams.filter((te: string) => te !== testExam);
    this.assignTaskForm.patchValue({ testExams: updatedTestExams });
  }

  getSelectedTestExams(): string[] {
    return this.assignTaskForm.get('testExams')?.value || [];
  }

  async loadTestExamsForType(examTypeId, examType): Promise<void> {
    try {
      const res = await this._taskService.getTestExams(this.assignTaskForm.get('student')?.value,examTypeId, examType);
      this.testExamsByType = res;
    } catch (error) {
      console.error('Error loading test exams:', error);
    }
  }

  selectTestExam(exam: any): void {
    const current = this.assignTaskForm.get('testExams')?.value || [];
    const exists = current.some((e: any) => e.id === exam.id);
  
    if (exists) {
      const updated = current.filter((e: any) => e.id !== exam.id);
      this.assignTaskForm.patchValue({ testExams: updated });
    } else {
      this.assignTaskForm.patchValue({ testExams: [...current, exam] });
    }
  }
  
  isTestExamSelected(exam: any): boolean {
    const selected = this.assignTaskForm.get('testExams')?.value || [];
    return selected.some((e: any) => e.id === exam.id);
  }

  async assignTask(): Promise<void> {
    if (this.assignTaskForm.valid) {
      this.isSubmitting = true;
      try {
        const payload = this.preparePayload();
        console.log('Valid Payload:', payload);
        if(this.taskGuid){
          payload.guid = this.taskGuid;
          this._taskService.updateTask(payload).then(res=>{
            this._taskService.openSnackBar('Task Updated','close');
            this._router.navigate(['/task/list']);
          })
        }else{
          this._taskService.createTask(payload).then(res=>{
            this._taskService.openSnackBar('Task Assigned','close')
            this._router.navigate(['/task/list']);
          })
        }
        
      } catch (error) {
        console.error('Error assigning task:', error);
        // Handle error
      } finally {
        this.isSubmitting = false;
      }
    } else {
      console.log('Form is invalid:', this.getFormErrors());
      this.assignTaskForm.markAllAsTouched();
    }
  }

  private preparePayload(): any {
    const formValue = this.assignTaskForm.value;
    console.log(formValue,"formValue")
    let payload = {
        title: formValue?.title,
        description: formValue?.description,
        date: formValue?.date,
        students: [formValue?.student?.id], 
        modules: formValue?.module,
        videoSubjects: formValue?.videoSubjects.map(u => u.id),
        videos: formValue?.videos.map(u => u.id),
        qbankSubjects: formValue?.qbankSubjects.map(u => u.subjectId),
        qbankExams: formValue?.qbankExams.map(u => (u && (u.id ?? u.examId))),
        examTypes : formValue?.examTypes.map(u => u.id),
        testExams: formValue?.testExams.map(u => u.id),
      }
    console.log(payload,"payload")
    return payload;
  }
}