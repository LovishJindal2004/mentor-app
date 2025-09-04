import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AssignStudentComponent } from '../assign-student/assign-student.component';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { StudentService } from '../../student-management/student.service';
import { helperService } from 'app/core/auth/helper';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommanService } from 'app/modules/common/services/common.service';
import { TaskService } from '../task.service';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-assign-task',
  imports: [
    MatSelectModule, 
    MatDatepickerModule, 
    MatIconModule, 
    MatTableModule, 
    MatCheckboxModule, 
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
  testExams = ['GRAND TEST 2022', 'GRAND TEST 2023', 'GRAND TEST 2024'];
  minDate: Date = new Date();
  dialogRef: any;
  userDetails: any;
  studentList: any[] = [];
  totalStudents = 0;
  pageSize = 10;
  pageNumber = 1;
  videoSubjects: any;
  videos: any;
  subjects: any;
  selectedStudents: any[] = [];
  isSubmitting = false;

  @ViewChild('studentPopup') studentPopup!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private _matDialog: MatDialog,
    private _studentService: StudentService,
    private _commanService: CommanService,
    private _taskService: TaskService,
    private _helperService: helperService
  ) {
    this.userDetails = this._helperService.getUserDetail();
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadStudents();
    this.loadInitialData();
  }

  private initializeForm(): void {
    this.assignTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: [null, Validators.required],
      module: ['Video', Validators.required], // Changed to array to support multiple modules
      
      // For Video module
      subject: [null],
      videos: [[]],
      topics: [[]],
      
      // For QBank module
      qbankSubjects: [[]],
      qbankExams: [[]],
      
      // For Test module
      examTypes: [[]],
      testExams: [[]],
      
      // Common
      students: [[], Validators.required]
    });

    // Subscribe to module changes - but don't clear data anymore
    this.assignTaskForm.get('module')?.valueChanges.subscribe(modules => {
      this.updateModuleValidators(modules);
    });

    // Initial validator setup
    this.updateModuleValidators(this.assignTaskForm.get('module')?.value);
  }

  private async loadInitialData(): Promise<void> {
    try {
      // Load all required data in parallel
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

  updateModuleValidators(modules: string[]): void {
    // Get all conditional form controls
    const videoControls = ['subject', 'topics', 'videos'];
    const qbankControls = ['qbankSubjects', 'qbankExams'];
    const testControls = ['examTypes', 'testExams'];
    const allConditionalControls = [...videoControls, ...qbankControls, ...testControls];

    // Clear all validators first
    allConditionalControls.forEach(controlName => {
      const control = this.assignTaskForm.get(controlName);
      if (control) {
        control.clearValidators();
        control.markAsUntouched();
        control.markAsPristine();
        control.setErrors(null);
      }
    });

    // Set validators based on selected modules
    if (modules && modules.includes('Video')) {
      this.assignTaskForm.get('subject')?.setValidators([Validators.required]);
      this.assignTaskForm.get('topics')?.setValidators([Validators.required, this.arrayNotEmptyValidator]);
      this.assignTaskForm.get('videos')?.setValidators([Validators.required, this.arrayNotEmptyValidator]);
    }
    
    if (modules && modules.includes('QBank')) {
      this.assignTaskForm.get('qbankSubjects')?.setValidators([Validators.required, this.arrayNotEmptyValidator]);
      this.assignTaskForm.get('qbankExams')?.setValidators([Validators.required, this.arrayNotEmptyValidator]);
    }
    
    if (modules && modules.includes('Test')) {
      this.assignTaskForm.get('examTypes')?.setValidators([Validators.required, this.arrayNotEmptyValidator]);
      this.assignTaskForm.get('testExams')?.setValidators([Validators.required, this.arrayNotEmptyValidator]);
    }

    // Update validation status for all controls
    allConditionalControls.forEach(controlName => {
      this.assignTaskForm.get(controlName)?.updateValueAndValidity({ emitEvent: false });
    });
  }

  // Custom validator for array fields
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

  // Helper method to check if a module is selected
  isModuleSelected(module: string): boolean {
    const selectedModules = this.assignTaskForm.get('module')?.value || [];
    return selectedModules.includes(module);
  }

  // Helper method to toggle module selection
  toggleModule(module: string): void {
    const currentModules = this.assignTaskForm.get('module')?.value || [];
    const moduleExists = currentModules.includes(module);
    
    if (moduleExists) {
      const updatedModules = currentModules.filter((m: string) => m !== module);
      this.assignTaskForm.patchValue({ module: updatedModules });
    } else {
      this.assignTaskForm.patchValue({ 
        module: [...currentModules, module] 
      });
    }
  }

  loadStudents(): void {
    const req = {
      keyword: '',
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      orderBy: '',
      sortOrder: ''
    };

    this._studentService.getAssignedStudentList(req, this.userDetails?.Id)
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

  // === STUDENT SELECTION METHODS ===
  isStudentSelected(student: any): boolean {
    return this.selectedStudents.some(s => s.id === student.id);
  }

  toggleStudent(student: any, event: any): void {
    if (event.checked) {
      if (!this.isStudentSelected(student)) {
        this.selectedStudents.push(student);
      }
    } else {
      this.selectedStudents = this.selectedStudents.filter(s => s.id !== student.id);
    }
    this.assignTaskForm.patchValue({ students: this.selectedStudents });
  }

  isAllSelected(): boolean {
    return this.studentList.length > 0 &&
      this.studentList.every(s => this.isStudentSelected(s));
  }

  isIndeterminate(): boolean {
    return this.selectedStudents.length > 0 && !this.isAllSelected();
  }

  toggleAllStudents(event: any): void {
    if (event.checked) {
      this.studentList.forEach(s => {
        if (!this.isStudentSelected(s)) {
          this.selectedStudents.push(s);
        }
      });
    } else {
      this.selectedStudents = this.selectedStudents.filter(
        s => !this.studentList.some(sl => sl.id === s.id)
      );
    }
    this.assignTaskForm.patchValue({ students: this.selectedStudents });
  }

  assignStudent(): void {
    this.dialogRef = this._matDialog.open(this.studentPopup, {
      width: '500px',
      panelClass: 'assign-students'
    });
  }

  // === VIDEO MODULE METHODS ===
  async selectVideoSubject(subject: any): Promise<void> {
    const currentSubjectIds = this.assignTaskForm.get('subject')?.value || [];
    // const subjectExists = currentSubjectIds.includes(subject.id);
    const subjectExists = currentSubjectIds.find((s: any) => s === subject.subjectId);
  
    if (subjectExists) {
      // Remove subject
      const updatedSubjectIds = currentSubjectIds.filter((id: any) => id !== subject.id);
      this.assignTaskForm.patchValue({ subject: updatedSubjectIds });
  
      // Remove topics linked to this subject
      const currentTopics = this.assignTaskForm.get('topics')?.value || [];
      const updatedTopics = currentTopics.filter((t: any) => t.subjectId !== subject.id);
      this.assignTaskForm.patchValue({ topics: updatedTopics });
  
      // Also clear videos belonging to removed topics
      const currentVideos = this.assignTaskForm.get('videos')?.value || [];
      const updatedVideos = currentVideos.filter((v: any) =>
        updatedTopics.some((t: any) => t.id === v.topicId)
      );
      this.assignTaskForm.patchValue({ videos: updatedVideos });
  
    } else {
      // Add subject
      this.assignTaskForm.patchValue({
        subject: [...currentSubjectIds, subject.id]
      });
      this.loadVideoTopicsForSubject(subject.id);
    }
  }
  async loadVideoTopicsForSubject(subjectId): Promise<void> {
    try {
      const res = await this._taskService.getVideoTopics(subjectId);
      const existingTopics = this.topics || [];
      const newTopics: any = res || [];
      
      // Create a Map to avoid duplicates based on topicName
      const topicMap = new Map();
      
      existingTopics.forEach((topic: any) => {
        topicMap.set(`${topic.topicName}_${topic.subjectId || subjectId}`, topic);
      });
      
      newTopics.forEach((topic: any) => {
        // Add subjectId to each topic for filtering
        const topicWithSubject = { ...topic, subjectId };
        topicMap.set(`${topic.topicName}_${subjectId}`, topicWithSubject);
      });
      
      this.topics = Array.from(topicMap.values());
    } catch (error) {
      console.error('Error loading QBank exams:', error);
    }
  }
  removeVideoSubject(subject: any): void {
    const currentSubjects = this.assignTaskForm.get('subject')?.value || [];
    const updatedSubjects = currentSubjects.filter((s: any) => s !== subject.id);
    this.assignTaskForm.patchValue({ subject: updatedSubjects });
    
    // Remove related exams when subject is removed
    const currentExams = this.assignTaskForm.get('topics')?.value || [];
    const updatedExams = currentExams.filter((exam: any) => 
      updatedSubjects.some((s: any) => s === exam.id)
    );
    this.assignTaskForm.patchValue({ topics: updatedExams });
  }
  // async selectVideoSubject(subject): Promise<void> {
  //   try {
  //     this.topics = await this._taskService.getVideoTopics(subject.id);
  //     // Reset topics and videos when subject changes
  //     this.assignTaskForm.patchValue({
  //       topics: [],
  //       videos: []
  //     });
  //     this.videos = null;
  //   } catch (error) {
  //     console.error('Error loading video topics:', error);
  //     this.topics = null;
  //   }
  // }

  selectTopic(topic: any): void {
    const currentTopics = this.assignTaskForm.get('topics')?.value || [];
    const topicExists = currentTopics.some((t: any) => t.id === topic.id);
    
    if (topicExists) {
      const updatedTopics = currentTopics.filter((t: any) => t.id !== topic.id);
      this.assignTaskForm.patchValue({ topics: updatedTopics });
    } else {
      this.assignTaskForm.patchValue({ 
        topics: [...currentTopics, topic] 
      });
      // Load videos for this topic
      this.loadVideosForTopic(topic.id);
    }
  }

  async loadVideosForTopic(topicId: string): Promise<void> {
    try {
      const videos = await this._taskService.getVideos(topicId);
      // Merge with existing videos to handle multiple topics
      const existingVideos = this.videos || [];
      const newVideos:any = videos || [];
      
      // Combine videos and remove duplicates
      const combinedVideos = [...existingVideos, ...newVideos];
      this.videos = combinedVideos.filter((video, index, self) => 
        index === self.findIndex((v) => v.id === video.id)
      );
    } catch (error) {
      console.error('Error loading videos for topic:', error);
    }
  }

  isTopicSelected(topic: any): boolean {
    const currentTopics = this.assignTaskForm.get('topics')?.value || [];
    return currentTopics.some((t: any) => t.id === topic.id);
  }

  removeTopic(topic: any): void {
    const currentTopics = this.assignTaskForm.get('topics')?.value || [];
    const updatedTopics = currentTopics.filter((t: any) => t.id !== topic.id);
    this.assignTaskForm.patchValue({ topics: updatedTopics });
  }

  getSelectedTopics(): any[] {
    return this.assignTaskForm.get('topics')?.value || [];
  }

  selectVideo(video: any): void {
    const currentVideos = this.assignTaskForm.get('videos')?.value || [];
    const videoExists = currentVideos.some((v: any) => v.id === video.id);
    
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

  // === QBANK MODULE METHODS ===
  selectqbankSubject(subject: any): void {
    const currentSubjects = this.assignTaskForm.get('qbankSubjects')?.value || [];
    const subjectExists = currentSubjects.find((s: any) => s.subjectId === subject.subjectId);
    
    if (subjectExists) {
      const updatedSubjects = currentSubjects.filter((s: any) => s.subjectId !== subject.subjectId);
      this.assignTaskForm.patchValue({ qbankSubjects: updatedSubjects });
      
      // Remove related exams when subject is removed
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

  removeQbankSubject(subject: any): void {
    const currentSubjects = this.assignTaskForm.get('qbankSubjects')?.value || [];
    const updatedSubjects = currentSubjects.filter((s: any) => s.subjectId !== subject.subjectId);
    this.assignTaskForm.patchValue({ qbankSubjects: updatedSubjects });
    
    // Remove related exams when subject is removed
    const currentExams = this.assignTaskForm.get('qbankExams')?.value || [];
    const updatedExams = currentExams.filter((exam: any) => 
      updatedSubjects.some((s: any) => s.subjectId === exam.subjectId)
    );
    this.assignTaskForm.patchValue({ qbankExams: updatedExams });
  }

  getSelectedQbankSubjects(): any[] {
    return this.assignTaskForm.get('qbankSubjects')?.value || [];
  }

  async loadQBankExamsForSubject(subjectId: string): Promise<void> {
    try {
      const res = await this._taskService.getQBankExams(subjectId);
      const existingExams = this.qbankExams || [];
      const newExams: any = res || [];
      
      // Create a Map to avoid duplicates based on topicName
      const examMap = new Map();
      
      existingExams.forEach((topic: any) => {
        examMap.set(`${topic.topicName}_${topic.subjectId || subjectId}`, topic);
      });
      
      newExams.forEach((topic: any) => {
        // Add subjectId to each topic for filtering
        const topicWithSubject = { ...topic, subjectId };
        examMap.set(`${topic.topicName}_${subjectId}`, topicWithSubject);
      });
      
      this.qbankExams = Array.from(examMap.values());
    } catch (error) {
      console.error('Error loading QBank exams:', error);
    }
  }

  selectqbankExam(exam: any): void {
    const currentExams = this.assignTaskForm.get('qbankExams')?.value || [];
    const examExists = currentExams.find((e: any) => e.examId === exam.examId);
    
    if (examExists) {
      const updatedExams = currentExams.filter((e: any) => e.examId !== exam.examId);
      this.assignTaskForm.patchValue({ qbankExams: updatedExams });
    } else {
      this.assignTaskForm.patchValue({ 
        qbankExams: [...currentExams, exam] 
      });
    }
  }

  isQbankExamSelected(exam: any): boolean {
    const currentExams = this.assignTaskForm.get('qbankExams')?.value || [];
    return currentExams.some((e: any) => e.examId === exam.examId);
  }

  removeQbankExam(exam: any): void {
    const currentExams = this.assignTaskForm.get('qbankExams')?.value || [];
    const updatedExams = currentExams.filter((e: any) => e.examId !== exam.examId);
    this.assignTaskForm.patchValue({ qbankExams: updatedExams });
  }

  getSelectedQbankExams(): any[] {
    return this.assignTaskForm.get('qbankExams')?.value || [];
  }

  // === TEST MODULE METHODS ===
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

  selecttestExam(testExam: string): void {
    const currentTestExams = this.assignTaskForm.get('testExams')?.value || [];
    const testExamExists = currentTestExams.includes(testExam);
    
    if (testExamExists) {
      const updatedTestExams = currentTestExams.filter((te: string) => te !== testExam);
      this.assignTaskForm.patchValue({ testExams: updatedTestExams });
    } else {
      this.assignTaskForm.patchValue({ 
        testExams: [...currentTestExams, testExam] 
      });
    }
  }

  isTestExamSelected(testExam: string): boolean {
    const currentTestExams = this.assignTaskForm.get('testExams')?.value || [];
    return currentTestExams.includes(testExam);
  }

  removeTestExam(testExam: string): void {
    const currentTestExams = this.assignTaskForm.get('testExams')?.value || [];
    const updatedTestExams = currentTestExams.filter((te: string) => te !== testExam);
    this.assignTaskForm.patchValue({ testExams: updatedTestExams });
  }

  getSelectedTestExams(): string[] {
    return this.assignTaskForm.get('testExams')?.value || [];
  }

  async assignTask(): Promise<void> {
    if (this.assignTaskForm.valid) {
      this.isSubmitting = true;
      try {
        const payload = this.preparePayload();
        console.log('Valid Payload:', payload);
        
        // Send payload to backend
        // const result = await this._taskService.assignTask(payload);
        // Handle success response
        
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
    const modules = formValue.module;

    const basePayload = {
      title: formValue.title,
      description: formValue.description,
      date: formValue.date,
      modules: modules, // Now supporting multiple modules
      students: formValue.students.map((s: any) => s.id)
    };

    const moduleData: any = {};

    // Add Video module data if selected
    if (modules.includes('Video')) {
      moduleData.video = {
        subject: formValue.subject,
        topics: formValue.topics.map((t: any) => t.id),
        videos: formValue.videos.map((v: any) => v.id)
      };
    }

    // Add QBank module data if selected
    if (modules.includes('QBank')) {
      moduleData.qbank = {
        subjects: formValue.qbankSubjects.map((s: any) => s.subjectId),
        exams: formValue.qbankExams.map((e: any) => e.examId)
      };
    }

    // Add Test module data if selected
    if (modules.includes('Test')) {
      moduleData.test = {
        examTypes: formValue.examTypes.map((et: any) => et.id),
        testExams: formValue.testExams
      };
    }

    return {
      ...basePayload,
      moduleData
    };
  }
}