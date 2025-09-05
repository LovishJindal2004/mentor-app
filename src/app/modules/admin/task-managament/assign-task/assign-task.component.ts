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
import { ActivatedRoute, Router } from '@angular/router';

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
  // testExams = ['GRAND TEST 2022', 'GRAND TEST 2023', 'GRAND TEST 2024'];
  testExamsByType:any;
  minDate: Date = new Date();
  dialogRef: any;
  userDetails: any;
  studentList: any[] = [];
  totalStudents = 0;
  pageSize = 10;
  pageNumber = 1;
  videoSubjects: any;
  videosByTopic: any; // Changed from 'videos' to 'videosByTopic' to match QBank pattern
  subjects: any;
  selectedStudents: any[] = [];
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
        // Patch only base fields; dependent multi-selects will be mapped after data loads
        this.assignTaskForm.patchValue({
          title: this.taskDetails?.title,
          description: this.taskDetails?.description,
          date: this.taskDetails?.date,
          module: this.taskDetails?.modules,
          videoSubjects: this.taskDetails?.videoSubjects,
          videos: this.taskDetails?.videos,
          qbankSubjects: this.taskDetails?.qbankSubjects,
          qbankExams: this.taskDetails?.qbankExams,
          // examTypes: this.taskDetails?.examTypes,
          testExams: this.taskDetails?.testExams,
          students: this.taskDetails?.students,
        });
        this.selectedStudents = this.taskDetails?.students?.map(student => ({ id: student }));
      })
    }
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadStudents().then(() => {
      this.loadInitialData().then(() => {
        if (this.taskGuid) {
          this._taskService.getTask(this.taskGuid).then(res => {
            this.taskDetails = res;
            this.patchEditFormValues(); // new function below
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

  // Map objects needed for patching
  const mappedStudents = this.mapIdsToObjects(td?.students, this.studentList, 'id');
  const mappedQbankSubjects = this.mapIdsToObjects(td?.qbankSubjects, this.subjects, 'subjectId');
  const mappedVideoSubjects = this.mapIdsToObjects(td?.videoSubjects, this.videoSubjects, 'id');
  
  // Map exam types from IDs - this is the key fix
  const mappedExamTypes = this.mapIdsToObjects(td?.examTypes, this.examTypes, 'id');

  // Patch base values first
  this.assignTaskForm.patchValue({
    title: td?.title,
    description: td?.description,
    date: td?.date,
    module: td?.modules,
    students: mappedStudents,
    qbankSubjects: mappedQbankSubjects,
    videoSubjects: mappedVideoSubjects,
    examTypes: mappedExamTypes,
    // Defer these until data sources are loaded below
    qbankExams: [],
    testExams: [],
    videos: []
  });

  // Load dependent data in parallel based on selections
  const videoLoads = (mappedVideoSubjects || []).map((s: any) => this.loadVideosForSubject(s.id));
  const qbankExamLoads = (mappedQbankSubjects || []).map((s: any) => this.loadQBankExamsForSubject(s.subjectId));
  
  // Load test exams for each mapped exam type - use examType and name properties
  const testExamLoads = (mappedExamTypes || []).map((examType: any) => 
    this.loadTestExamsForType(examType.examType || examType.id, examType.name)
  );

  await Promise.all([...videoLoads, ...qbankExamLoads, ...testExamLoads]);

  // After data loads, patch selected collections by IDs
  const selectedVideos = this.findItemsByIds(td?.videos, this.videosByTopic, 'id', 'videos');
  const selectedQbankExams = this.findItemsByIds(td?.qbankExams, this.qbankExams, 'id', 'exams');
  
  // Map test exam IDs to actual exam objects from the loaded testExamsByType
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
      
      // For Video module - Updated to match QBank pattern
      videoSubjects: [[]],
      videos: [[]],
      
      // For QBank module
      qbankSubjects: [[]],
      qbankExams: [[]],
      
      // For Test module
      examTypes: [[]],
      testExams: [[]],
      
      // Common
      students: [[], Validators.required]
    });

    // Subscribe to module changes
    this.assignTaskForm.get('module')?.valueChanges.subscribe(module => {
      this.updateModuleValidators(module);
    });

    // Initial validator setup
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
    // Get all conditional form controls
    const videoControls = ['videoSubjects', 'videos'];
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

    // Set validators based on selected module
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

  // === VIDEO MODULE METHODS - Updated to match QBank pattern ===
  selectVideoSubject(subject: any): void {
    const currentSubjects = this.assignTaskForm.get('videoSubjects')?.value || [];
    const subjectExists = currentSubjects.find((s: any) => s.id === subject.id);
    
    if (subjectExists) {
      const updatedSubjects = currentSubjects.filter((s: any) => s.id !== subject.id);
      this.assignTaskForm.patchValue({ videoSubjects: updatedSubjects });
      
      // Remove related videos when subject is removed
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
    
    // Remove related videos when subject is removed
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
      const res = await this._taskService.getVideos(subjectId);
      const existingVideos = this.videosByTopic || [];
      const newVideos: any = res || [];
      
      // Create a Map to avoid duplicates based on topicName
      const videoMap = new Map();
      
      existingVideos.forEach((topic: any) => {
        videoMap.set(`${topic.topicName}_${topic.subjectId || subjectId}`, topic);
      });
      
      newVideos.forEach((topic: any) => {
        // Add subjectId to each topic for filtering
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

  // isTestExamSelected(testExam: string): boolean {
  //   const currentTestExams = this.assignTaskForm.get('testExams')?.value || [];
  //   return currentTestExams.includes(testExam);
  // }

  removeTestExam(testExam: string): void {
    const currentTestExams = this.assignTaskForm.get('testExams')?.value || [];
    const updatedTestExams = currentTestExams.filter((te: string) => te !== testExam);
    this.assignTaskForm.patchValue({ testExams: updatedTestExams });
  }

  getSelectedTestExams(): string[] {
    return this.assignTaskForm.get('testExams')?.value || [];
  }
  async loadTestExamsForType(examTypeId,examType): Promise<void> {
    try {
      const res = await this._taskService.getTestExams(examTypeId,examType); // implement this method in your service
      this.testExamsByType = res
      // const existing = this.testExamsByType.find(e => e.examTypeId === examTypeId);
      // const newEntry = { examTypeId, exams: res || [] };
  
      // if (!existing) {
      //   this.testExamsByType = [...this.testExamsByType, newEntry];
      // } else {
      //   this.testExamsByType = this.testExamsByType.map(e =>
      //     e.examTypeId === examTypeId ? newEntry : e
      //   );
      // }
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
        students: formValue?.students.map(u => u.id),
        modules: formValue?.module,
        // status: 0,
        // taskType: 0,
        // taskSubType: 0,
        // chapters: [],
        // topics: [],
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