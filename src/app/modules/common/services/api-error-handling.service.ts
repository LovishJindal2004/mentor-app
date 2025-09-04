import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class ApiErrorHandlerService {

  constructor(private snackBar: MatSnackBar) { }

  handleError(error: any): void {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 400) {
        this.showSnackBar("Bad Request");
      } else if (error.status === 401) {
        this.showSnackBar("Unthorized Access");
      } else if (error.status === 404) {
        this.showSnackBar("Not Found Please Contact supporter"
        );
      } else {
        this.showSnackBar('Something wrong Please Contact supporter');
      }
    } else {
      // Handle non-HTTP errors
      if (error.Status == 400) {
        this.showSnackBar(error.Message);
      }

    }
  }
  SignUphandleError(error: any): void {
    if (error instanceof HttpErrorResponse) {
      this.showSnackBar(error.error.exception
      );
    } else {
      // Handle non-HTTP errors
      if (error.Status == 400) {
        this.showSnackBar(error.Message);
      }

    }
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top'
    });
  }
}
