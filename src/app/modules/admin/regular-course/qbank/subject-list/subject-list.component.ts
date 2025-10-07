import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApexOptions } from 'apexcharts';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  NgApexchartsModule
} from "ng-apexcharts";
import { ApiErrorHandlerService } from 'app/modules/common/services/api-error-handling.service';
import { QbankSubject } from '../qbanks.model';
import { DataGuardService } from 'app/core/auth/guards/dataGuard';
import { QBanksService } from '../qbanks.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
export type linearChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
};

@Component({
  selector: 'app-subject-list',
  imports: [
    CommonModule,
    MatIconModule,
    MatTabsModule,
    MatSelectModule,
    MatInputModule,
    MatChipsModule,
    NgApexchartsModule,
    MatProgressBarModule,
    MatListModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatDatepickerModule,
    FormsModule,
    MatSnackBarModule,
    MatPaginatorModule,
    RouterModule,
    MatDialogModule],
  templateUrl: './subject-list.component.html',
  styleUrl: './subject-list.component.scss'
})
export class SubjectListComponent implements OnInit {
  selectedTabIndex: any = 0;
  courseId: string = '';
  SubjectDetail: QbankSubject[] = [];
  noOfTotelModule: number = 0;
  noOfTotalQuestions: number = 0;
  noOfCompletedTotelModule: number = 0;
  BookmarkCount: number = 0;
  pieChartOptions: ApexOptions = {};
  showtracker:boolean=false;
  dynamicContent: { [year: number]: { [month: number]: { [day: string]: string } } } = {};
  currentDisplayedYear: number = new Date().getFullYear(); // Default to current year
  currentDisplayedMonth: number = new Date().getMonth(); // Default to current month


  @ViewChild('openDatePickerTemplate') openDatePickerTemplate!: TemplateRef<any>;
  constructor(
    private _datagurd: DataGuardService,
    private _qbankservice: QBanksService,
    public dialog: MatDialog,
    private _errorHandling: ApiErrorHandlerService,
  ) {
    
   }

  ngOnInit(): void {
    this.courseId = this._datagurd.getCourseId();
    this._qbankservice.getQbanksubjectsbyCourseId(this.courseId).subscribe((res: QbankSubject[]) => {
      if (res) {
        this.SubjectDetail = res.map(subject => ({
          ...subject,
          pieChartOptions: this.getPieChartOptions(subject.totalNoOfCompletedModules, subject.totalNoOfModules)
        }));
        this.SubjectDetail.forEach(subject => {
          this.noOfTotelModule += subject.totalNoOfModules;
          this.noOfTotalQuestions += subject.noOfQuestions;
          this.noOfCompletedTotelModule += subject.totalNoOfCompletedModules;
        })
        this.showtracker= true;
      }

    }, (error) => {
      this._errorHandling.handleError(error);
    });
    this._qbankservice.getBookmarkCount().subscribe(res => {
      this.BookmarkCount = res;
    }, (error) => {
      this._errorHandling.handleError(error);
    })
  }
  openDatePicker(): void {
    const dialogRef = this.dialog.open(this.openDatePickerTemplate, {
      panelClass: 'datePicker-container',
    });
    this.pieChartOptions = {
      series: [this.noOfCompletedTotelModule/this.noOfTotelModule*100],
      chart: {
        height: 150,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: '40%',
            margin: 0,

          },
          track: {
            show: true,
            background: '#e7e7e7',
            strokeWidth: '60%',
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              show: false,
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#28c397',
              formatter: function (val: number) {
                const valStr = val.toString();
                if (valStr.includes('.')) {
                  return `${val.toFixed(2)}%`;
                } else {
                  return `${val}`;
                }
              },
              offsetY: 3,
            }
          },
        },
      },
      labels: [""],
      colors: ["#19a9a0"],  // Adjust color if needed
      responsive: [
        {
          breakpoint: 1921,
          options: {
            chart: {
              width: 260
            },
            legend: {
              show: false,
            },
          },
        }
      ]
    };

    dialogRef.afterOpened().subscribe(() => {
      // Fetch data for the current month and year
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      setTimeout(() => {
        this.loadMonthData(currentYear, currentMonth);
      }, 500);
      
    });
  }
  loadMonthData(year: number, month: number): void {
    // Ensure that the year and month are valid before making the API call
    if (year && month !== undefined) {
      const request = { year: year, month: month + 1 };
      // Clear previous month data to avoid conflicts
      this._qbankservice.getDayWiseQbankCompletedByMonth(request).subscribe(
        (response) => {
          const monthData: { [day: string]: string } = {};

          response.forEach((item: { day: number, totalQbankCompleted: number }) => {
            monthData[item.day] = `${item.totalQbankCompleted}`;
          });

          // Update the dynamicContent with the data for the current year and month
          this.dynamicContent[year] = {
            [month]: monthData
          };

          this.updateCalendarContent();  // Update the calendar UI
        },
        (error) => {
          console.error('Error loading data from API:', error);
        }
      );
    }
  }
  updateCalendarContent(): void {
    const cells = document.querySelectorAll('.mat-calendar-body-cell');
    cells.forEach((cell: HTMLElement) => {
      const dateElement = cell.querySelector('.mat-calendar-body-cell-content') as HTMLElement;
      if (dateElement) {
        const cellDate = dateElement.innerText.trim(); // Get the date from the cell
        // const content = this.dynamicContent[this.currentDisplayedMonth]?.[cellDate]; // Get content for the current month and day
        const content = this.dynamicContent[this.currentDisplayedYear]?.[this.currentDisplayedMonth]?.[cellDate]; // Get content for the current year, month, and day
        // on this its checks if corroesponding date have any content or not
        // Check if content exists for the current month and day
        if (content) {
          // Clear existing content
          const existingSpan = cell.querySelector('span');
          if (existingSpan) {
            existingSpan.remove(); // Remove old content
          }
          // Create a new span element to hold the dynamic content
          const span = document.createElement('span');
          span.innerText = content; // Set the inner text to the dynamic content
          span.classList.add('dynamic-content'); // Add the CSS class for styling
          cell.style.position = 'relative';
          cell.appendChild(span); // Append the new content span
        }
      }
    });
  }

  getPieChartOptions(completedModules: number, totalModules: number): ApexOptions {
    const percentage = (completedModules / totalModules) * 100;
    return {
      series: [percentage],
      chart: {
        height: 110,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: '40%',
            margin: 0,
        
          },
          track: {
            show: true,
            background: '#e7e7e7',
            strokeWidth: '60%',
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              show: true,
              fontSize: '12px',
              fontWeight: 'bold',
              formatter: function (val: number) {
                const valStr = val.toString();
                if (valStr.includes('.')) {
                  return `${val.toFixed(2)}%`;
                } else {
                  return `${val}%`;
                }
              },
              offsetY: 3,
            }
          },
        },
      },
      labels: [""],
      colors: ["#19a9a0"],  // Adjust color if needed
      responsive: [
        {
          breakpoint: 1921,
          options: {
            chart: {
              width: 100
            },
            legend: {
              show: false,
            },
          },
        }
      ]
    };
  }
  handleViewChanged(event: any): void {
    const activeDateElement = document.querySelector('.mat-calendar-period-button');
    if (activeDateElement) {
      const monthYearText = activeDateElement.textContent?.split(' ') || [];
      const monthName = monthYearText[0];
      const year = parseInt(monthYearText[1], 10);

      const newMonth = this.getMonthIndex(monthName);
      const newYear = year;

      // Ensure both year and month are selected before calling API
      if (newMonth !== undefined && newYear !== undefined) {
        // Only call the API if the month or year has changed
        if (newMonth !== this.currentDisplayedMonth || newYear !== this.currentDisplayedYear) {
          this.currentDisplayedMonth = newMonth;
          this.currentDisplayedYear = newYear;

          this.loadMonthData(this.currentDisplayedYear, this.currentDisplayedMonth);
        }
      }
    }
  }
  getMonthIndex(monthName: string): number {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return months.indexOf(monthName.toUpperCase());
  }

}