import { Component, ElementRef, NgZone, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';


import { helperService } from 'app/core/auth/helper';
import { User } from 'app/core/user/user.types';
import { FuseConfigService } from '@fuse/services/config';
import { environment } from 'environment/environment';
import { ValidationsService } from 'app/modules/common/services/validation.service';
import { ApiErrorHandlerService } from 'app/modules/common/services/api-error-handling.service';
import { CommanService } from 'app/modules/common/services/common.service';
import { DataGuardService } from 'app/core/auth/guards/dataGuard';
import { CousreService } from 'app/modules/common/services/course.service';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { SignalRService } from 'app/modules/common/services/signalR.service';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrl:'./sign-in.component.scss',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    imports: [
        RouterLink,
        // FuseAlertComponent,
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        CommonModule
    ],
})
export class AuthSignInComponent implements OnInit {
    // @ViewChild('signUpNgForm') signUpNgForm: NgForm;
    @ViewChild('otp1') otp1Input!: ElementRef<HTMLInputElement>;
    @ViewChild('otp2') otp2Input!: ElementRef<HTMLInputElement>;
    @ViewChild('otp3') otp3Input!: ElementRef<HTMLInputElement>;
    @ViewChild('otp4') otp4Input!: ElementRef<HTMLInputElement>;

    @ViewChild('otp5') otp5Input!: ElementRef<HTMLInputElement>;
    @ViewChild('otp6') otp6Input!: ElementRef<HTMLInputElement>;
    @ViewChild('otp7') otp7Input!: ElementRef<HTMLInputElement>;
    @ViewChild('otp8') otp8Input!: ElementRef<HTMLInputElement>;

    @ViewChild('otp9') otp9Input!: ElementRef<HTMLInputElement>;
    @ViewChild('otp10') otp10Input!: ElementRef<HTMLInputElement>;
    @ViewChild('otp11') otp11Input!: ElementRef<HTMLInputElement>;
    @ViewChild('otp12') otp12Input!: ElementRef<HTMLInputElement>;
    LogoUrl: string;
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    signUpForm: FormGroup;
    signInForm: FormGroup;
    signInWithEmailPassword: FormGroup;
    signupwithphone: FormGroup;
    LoginWithphone: FormGroup;
    signupwithemail: FormGroup;
    OtpFormForloginWithPhoneAndEmail: FormGroup;  //form contol for otp for both email and phone by harsh
    OtpForm: FormGroup;
    currentStep: string = 'emailLogin';
    previousStep: string | null = null;
    OtpFormTitle: any;
    showAlert: boolean = false;
    userModel: User;
    RoleId: User;
    LoginType: any;
    signInErrorMessage: any;
    IsuserVerified: boolean = false;
    OtpErrorMessage: any;
    isFormSubmitted = true;
    strapperindex: any;
    OTPLoginType: any;// for otp Login Type like signin or signup 
    IsUserFromSignup: boolean = false;
    isOnchangedClick: boolean = false;
    @ViewChild('stepper') stepper!: MatStepper;
    url = '../../../../assets/images/images/user .png';
    isLinear = false;
    IssignInEmailHasError: boolean = false;
    IssignInPhoneHasError: boolean = false;
    IssignUpEmailHasError: boolean = false;
    IssignUpPhoneHasError: boolean = false;
    IssignUppasswordHasError: boolean = false;
    IsOtpFormHasError: boolean = false;
    CourseDetails: any = [];
    countryCode: any = [];
    isIndianNumber: boolean = true;               // to hide mobile field if number doen't start with +91
    OTPLoginPhoneType: string;                    //added by harsh to show phone number binding
    selectedCountryCodeForVerification: string;   //added by harsh to show countryCode  binding
    userName: String;
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _route: ActivatedRoute,
        private snackBar: MatSnackBar,
        private _dataGuardService: DataGuardService,
        private _ngZone: NgZone,
        private _CommanService: CommanService,
        private _helperservice: helperService,
        private _fuseConfigService: FuseConfigService,
        private _errohendling: ApiErrorHandlerService,
        private courseService: CousreService,
        private errorhandling: ApiErrorHandlerService,
        private _signalRService: SignalRService,

    ) {
        this._CommanService.getTenantDetails.subscribe((TenantInfo: any) => {
            this.LogoUrl = TenantInfo.Logo;
            this._fuseConfigService.config = { theme: TenantInfo.ThemeID };
            this._fuseConfigService.config = { scheme: TenantInfo['SchemaID']?.toLowerCase() };
        });

    }
    ngOnInit(): void {
        this.signupwithphone = this._formBuilder.group({
            CountryCode: ['+91'],
            PhoneNumber: ['', [Validators.required, ValidationsService.phoneNumberValidator]]
        });
        this.LoginWithphone = this._formBuilder.group({
            CountryCode: ['+91'],
            PhoneNumber: ['', [Validators.required, ValidationsService.phoneNumberValidator]]
        });
        this.signUpForm = this._formBuilder.group({
            name: ['', [Validators.required]],
            email: ['', [Validators.required, ValidationsService.emailValidator]],
            // added this to add phone number field
            CountryCode: ['+91'],
            PhoneNumber: ['', [Validators.required, ValidationsService.phoneNumberValidator]]
        });
        this.signInForm = this._formBuilder.group({
            email: ['', [Validators.required, ValidationsService.emailValidator]]
        });
        this.OtpForm = this._formBuilder.group({
            Otp1: ['', Validators.required],
            Otp2: ['', Validators.required],
            Otp3: ['', Validators.required],
            Otp4: ['', Validators.required],
        }, { validator: this.otpRequiredValidator() });

        this.signInWithEmailPassword = this._formBuilder.group({
            email: ['', [Validators.required, ValidationsService.emailValidator]],
            Password: ['', Validators.required]
        });

        // SIGN UP OTP FOR MOBILE AND EMAIL

        this.OtpFormForloginWithPhoneAndEmail = this._formBuilder.group({
            emailOtpGroup: this._formBuilder.group({
                Otp5: ['', Validators.required],
                Otp6: ['', Validators.required],
                Otp7: ['', Validators.required],
                Otp8: ['', Validators.required]
            }, { validator: this.otpRequiredValidatorForEmail() }),
            phoneOtpGroup: this._formBuilder.group({
                Otp9: ['', Validators.required],
                Otp10: ['', Validators.required],
                Otp11: ['', Validators.required],
                Otp12: ['', Validators.required]
            }, { validator: this.otpRequiredValidatorForMobile() })
        });

        // eNDS


        // get country code
        this._CommanService.getCountryCode().subscribe((responce: any) => {

            this.countryCode = responce;
        })
        // eNDS
    }
    //this function for checkOtpForm control and show error message if empty any field
    otpRequiredValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const otpFields = ['Otp1', 'Otp2', 'Otp3', 'Otp4'];
            const hasEmptyField = otpFields.some(field => !control.get(field)?.value);
            return hasEmptyField ? { 'required': true } : null;
        };
    }

    otpRequiredValidatorForEmail(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const otpFields = ['Otp5', 'Otp6', 'Otp7', 'Otp8'];
            const hasEmptyField = otpFields.some(field => !control.get(field)?.value);
            return hasEmptyField ? { 'required': true } : null;
        };
    }
    otpRequiredValidatorForMobile(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const otpFields = ['Otp9', 'Otp10', 'Otp11', 'Otp12'];
            const hasEmptyField = otpFields.some(field => !control.get(field)?.value);
            return hasEmptyField ? { 'required': true } : null;
        };
    }

    OnChange() {

        this.currentStep = this.previousStep;
        this.isIndianNumber = true;
        this.IsOtpFormHasError = false;
        this.IssignUpPhoneHasError = false;
        this.IssignInEmailHasError = false;
        this.IssignInPhoneHasError = false;
        this.IssignUpEmailHasError = false;
        this.IsUserFromSignup = false;
        this.IssignUppasswordHasError = false;
        this.isOnchangedClick = true;

    }
    //For navigate between stapper
    signUPWithEmail() {
        this.currentStep = "emailSignup";
        this.signInErrorMessage = '';
        this.IsOtpFormHasError = false;
        this.IssignUpPhoneHasError = false;
        this.IssignInEmailHasError = false;
        this.IssignInPhoneHasError = false;
        this.IssignUpEmailHasError = false;
        this.IssignUppasswordHasError = false;
    }
    singUpWithPhone() {
        // this.currentStep = "signupPhone";  //commented this to show on both email and password field
        this.currentStep = "emailSignup";
        this.signInErrorMessage = '';
        this.IsOtpFormHasError = false;
        this.IssignUpPhoneHasError = false;
        this.IssignInEmailHasError = false;
        this.IssignInPhoneHasError = false;
        this.IssignUpEmailHasError = false;
        this.IssignUppasswordHasError = false;
    }
    signInWithEmail() {
        this.currentStep = "emailLogin";

        this.signInErrorMessage = '';
        this.IsOtpFormHasError = false;
        this.IssignUpPhoneHasError = false;
        this.IssignInEmailHasError = false;
        this.IssignInPhoneHasError = false;
        this.IssignUpEmailHasError = false;
        this.IsUserFromSignup = false;
        this.IssignUppasswordHasError = false;
    }
    signInWithPhone() {
        this.currentStep = "loginPhone";
        this.signInErrorMessage = '';
        this.IsOtpFormHasError = false;
        this.IssignUpPhoneHasError = false;
        this.IssignInEmailHasError = false;
        this.IssignInPhoneHasError = false;
        this.IssignUpEmailHasError = false;
        this.IsUserFromSignup = false;
        this.IssignUppasswordHasError = false;
    }
    signInWithEmailPasseword() {
        this.currentStep = "signInWithEmailPasseword";
        this.signInErrorMessage = '';
        this.IsOtpFormHasError = false;
        this.IssignUpPhoneHasError = false;
        this.IssignInEmailHasError = false;
        this.IssignInPhoneHasError = false;
        this.IssignUpEmailHasError = false;
        this.IsUserFromSignup = false;
        this.IssignUppasswordHasError = false;
    }

    onPaste(event: ClipboardEvent): void {
        event.preventDefault();

        const clipboardData = event.clipboardData || (window as any).clipboardData;
        const pastedText = clipboardData.getData('text');

        const otpDigits = pastedText.replace(/\D/g, ''); // Remove non-digit characters

        this.OtpForm.patchValue({
            Otp1: otpDigits.charAt(0) || '',
            Otp2: otpDigits.charAt(1) || '',
            Otp3: otpDigits.charAt(2) || '',
            Otp4: otpDigits.charAt(3) || ''
        });

        // Manually mark the form control as touched to trigger validation
        this.OtpForm.markAllAsTouched();

        // Trigger change events to update FormControl values
        this.onInputChange(this.otp1Input.nativeElement, this.otp2Input.nativeElement);
        this.onInputChange(this.otp2Input.nativeElement, this.otp3Input.nativeElement);
        this.onInputChange(this.otp3Input.nativeElement, this.otp4Input.nativeElement);
    }
    // End navigation
    resendOTP() {
        this.signIn(this.LoginType, true)
    }

    // Sign in Flow
    signIn(loginType, isResendOtp: boolean = false): void {
        this.OtpForm.reset();
        var self = this;
        if (!isResendOtp) {
            this.currentStep = this.currentStep;
            this.previousStep = this.currentStep;
        }

        this.isOnchangedClick = true;
        this.LoginType = loginType; // Store LoginType like Signin with email or phone.
        var user = {
            loginId: this.signInForm.get('email').value.toString(),
            loginIdPrefix: "",
            loginType: 1
        };
        if (loginType === 'email') {
            this.OTPLoginType = this.signInForm.get('email').value; // SetOtp Login Type
            this.OtpFormTitle = "LOGIN"
            if (this.IsUserFromSignup == true) {
                this.OTPLoginType = this.signUpForm.get('email').value; // SetOtp Login Type
                this.OtpFormTitle = "SIGNUP"
                user.loginId = this.signUpForm.get('email').value;
            }
            else {
                if (this.signInForm.invalid) {// return if form is invalid
                    this.IssignInEmailHasError = true;
                    return;
                }
                user.loginId = this.signInForm.get('email').value.toString();
            }
            this._authService.StudentLogin(user).subscribe(response => {// Api call 
                if (response.otpSend == true) {
                    this.currentStep = "otp"
                    this.snackBar.open(response.message
                        , 'Close', {
                        duration: 3000,
                        verticalPosition: 'top'
                    });

                }
            }, (error) => {
                // if (error.status == 404) {

                // this.signInErrorMessage = error.error.exception;
                // setTimeout(() => {
                //     this.signInErrorMessage = '';
                // }, 5000);
                // // }
                this._errohendling.SignUphandleError(error);
            }
            )
        }
        else {// Else part for Phonenumber
            if (!isResendOtp) {
                this.currentStep = this.currentStep;
                this.previousStep = this.currentStep;
            }
            this.OTPLoginType = this.LoginWithphone.get('PhoneNumber').value; // set phone number for Otp screen 

            this.OtpFormTitle = "LOGIN"
            if (this.IsUserFromSignup == true) {
                this.OTPLoginType = this.signupwithphone.get('PhoneNumber').value; // SetOtp Login Type
                this.OtpFormTitle = "SIGNUP"
                user.loginId = this.signupwithphone.get('PhoneNumber').value.toString(),
                    user.loginType = 0;
                // user.loginIdPrefix = "+91"
                user.loginIdPrefix = this.LoginWithphone.get('CountryCode').value.toString();
            }
            else {
                if (this.LoginWithphone.invalid) {
                    this.IssignInPhoneHasError = true;
                    return;
                }
                user.loginId = this.LoginWithphone.get('PhoneNumber').value.toString();
                user.loginType = 0;
                // user.loginIdPrefix = "+91"
                user.loginIdPrefix = this.LoginWithphone.get('CountryCode').value.toString();
            }
            this._authService.StudentLogin(user).subscribe(response => { // Call Api here for LoginWithPhone
                if (response.otpSend == true) {
                    this.currentStep = "otp"
                    this.snackBar.open(response.message
                        , 'Close', {
                        duration: 3000,
                        verticalPosition: 'top'
                    });

                    // this.signUpForm.reset();
                }
            }, (error) => {// catch error here 
                if (error.status == 404) {
                    this.signInErrorMessage = error.error.exception;
                    setTimeout(() => {
                        this.signInErrorMessage = '';
                    }, 5000);
                }
                this._errohendling.SignUphandleError(error);
            }
            )
        }
    }
    //SignIn Flow End

    //Sign up flow
    // Signup(SignupType: any) {

    //     this.OtpForm.reset();
    //     this.currentStep = this.currentStep;
    //     this.previousStep = this.currentStep;
    //     this.LoginType = SignupType;// set Login type here like email or phone 
    //     this.IsUserFromSignup = true;
    //     this.isOnchangedClick = true; // this is for check Signup for Login for Otp screen 
    //     if (SignupType == 'email') {
    //         this.OTPLoginType = this.signUpForm.get('email').value;
    //         this.OTPLoginPhoneType = this.signUpForm.get('PhoneNumber').value; // added by harsh to show   phoneNumber 
    //         this.OtpFormTitle = "SIGN UP"
    //         if (this.signUpForm.invalid) {
    //             this.IssignUpEmailHasError = true;
    //             this.IssignInPhoneHasError = true;  // added by harsh to show error for phoneNumber 
    //             return;
    //         }
    //         let user = {
    //             loginId: this.signUpForm.get('email').value,
    //             loginIdPrefix: "",
    //             loginType: 1
    //         };
    //         this._authService.StundeSignUp(user).subscribe(response => {
    //             if (response.otpSend == true) {
    //                 // this.currentStep = "otp"                    
    //                 // commented this so that it should redirect on email and mobile screen by harsh
    //                 this.currentStep = "otpForloginWithPhoneAndEmail";
    //                 this.snackBar.open(response.message, 'Close', {
    //                     duration: 3000,
    //                     verticalPosition: 'top'
    //                 });
    //                 // this.stepper.selectedIndex = 4;
    //             }
    //         }, (error) => {
    //             if (error.status == 404) {
    //                 this.signInErrorMessage = error.error.exception;
    //                 setTimeout(() => {
    //                     this.signInErrorMessage = '';
    //                 }, 5000);
    //             }
    //             this._errohendling.handleError(error);
    //         }
    //         )
    //     } else {
    //         // this.strapperindex = this.stepper.selectedIndex;
    //         if (this.signupwithphone.invalid) {
    //             this.IssignUpPhoneHasError = true;
    //             return;
    //         }
    //         this.OTPLoginType = this.signupwithphone.get('PhoneNumber').value;
    //         this.OtpFormTitle = "SIGN UP"
    //         let user = {
    //             loginId: this.signupwithphone.get('PhoneNumber').value.toString(),
    //             loginIdPrefix: "91",
    //             loginType: 0
    //         };
    //         this._authService.StundeSignUp(user).subscribe(response => {
    //             if (response.otpSend == true) {
    //                 this.currentStep = "otp"
    //                 this.snackBar.open(response.message
    //                     , 'Close', {
    //                     duration: 3000,
    //                     verticalPosition: 'top'
    //                 });
    //                 // this.stepper.selectedIndex = 4;
    //             }
    //         }, (error) => {
    //             if (error.status == 404) {
    //                 this.signInErrorMessage = error.error.exception;
    //                 setTimeout(() => {
    //                     this.signInErrorMessage = '';
    //                 }, 5000);
    //             }
    //             this._errohendling.handleError(error);
    //         }
    //         )
    //     }

    // }
    resendOTPForBothVerification() {

        this.Signup(true);
    }
    Signup(isResendOtp: boolean = false) {

        if (!isResendOtp) {
            this.currentStep = this.currentStep;
            this.previousStep = this.currentStep;
        }
        // Reset the OTP form to clear any previous OTP inputs
        this.OtpFormForloginWithPhoneAndEmail.reset();



        // Set state variables for tracking steps and login type
        // this.currentStep = this.currentStep;
        // this.previousStep = this.currentStep;

        // Set flags indicating that the user is coming from the signup process
        this.IsUserFromSignup = true;
        this.isOnchangedClick = true;

        // Set the title for the OTP form
        this.OtpFormTitle = "SIGN UP";

        // Check if either email or phone number fields are invalid
        if (this.signUpForm.invalid) {
            // Set error flags if validation fails
            this.IssignUpEmailHasError = true;
            this.IssignInPhoneHasError = true;
            return;
        }

        // Extract values for email and phone number from the form
        this.userName = this.signUpForm.get('name').value;
        this.OTPLoginType = this.signUpForm.get('email').value; // Email value
        this.OTPLoginPhoneType = this.signUpForm.get('PhoneNumber').value; // Phone number value
        this.selectedCountryCodeForVerification = this.signUpForm.get('CountryCode').value; // Phone number value
        let user = {
            phone: this.OTPLoginPhoneType, // Phone number
            email: this.OTPLoginType, // Email as loginId
            countryCode: this.selectedCountryCodeForVerification,
            name: this.userName
        };

        // Call the signup API with the user details
        this._authService.sighUpWithEmailAndPhone(user).subscribe(response => {
            // If the OTP was successfully sent, proceed to the OTP screen
            if (response.otpSend == true) {
                // Redirect to OTP screen for both phone and email

                if (!isResendOtp) {

                    if (Array.isArray(environment.supportedCountryCode) &&
                        (environment.supportedCountryCode.includes('All') ||
                            environment.supportedCountryCode.includes(this.selectedCountryCodeForVerification))) {
                        this.currentStep = "otpForloginWithPhoneAndEmail"; // Normal flow when country code is +91
                    } else {
                        this.isIndianNumber = false;
                        this.LoginType = "email"; // Set type to email when country code is not +91
                        this.currentStep = "otpForloginWithPhoneAndEmail"; // Use "otp" if the country code is not +91


                    }
                }
                this.snackBar.open(response.message, 'Close', {
                    duration: 3000,
                    verticalPosition: 'top'
                });
            }
        }, (error) => {
            // Error handling logic, displaying appropriate error messages
            if (error.status == 404) {
                this.signInErrorMessage = error.error.exception;
                setTimeout(() => {
                    this.signInErrorMessage = '';
                }, 5000);
            }
            this._errohendling.SignUphandleError(error);
        });
    }


    // End sign up flow 

    onSubmitOTP(IsChangeCliked = this.isOnchangedClick) {

        if (!IsChangeCliked)
            this.currentStep = this.previousStep;
        var self = this;
        var OTP = this.OtpForm.get('Otp1').value?.toString() + this.OtpForm.get('Otp2').value?.toString() + this.OtpForm.get('Otp3').value?.toString() + this.OtpForm.get('Otp4').value?.toString();
        if (this.OtpForm.invalid) {
            this.IsOtpFormHasError = true;
            return;
        }
        var user = {
            loginId: this.signInForm.get('email').value.toString(),
            loginIdPrefix: "",
            loginType: 1,
            otp: OTP
        };
        if (this.LoginType == "email") {

            if (this.IsUserFromSignup == true) {
                user.loginId = this.signUpForm.get('email').value.toString();
            } else {
                user.loginId = this.signInForm.get('email').value.toString();
            }
            this._authService.verifyOtp(user).subscribe(response => {
                if (response) {
                    self._dataGuardService.setLocalData('accessToken', JSON.stringify(response.token).replace(/"/g, ''));
                    self._dataGuardService.setLocalData('refreshToken', JSON.stringify(response.refreshToken).replace(/"/g, ''));
                    this.RoleId = this._helperservice.getUserDetail();
                    localStorage.setItem('studentName', this.RoleId.Name);
                    // this.NavigationByRole();
                    this.LoadMore();
                }
            }, (error) => {
                if (error) {
                    this.OtpErrorMessage = error.error.exception;
                    setTimeout(() => {
                        this.OtpErrorMessage = '';
                    }, 5000);
                }

            }
            )
        }
        else {
            if (!IsChangeCliked)
                this.currentStep = this.previousStep;
            // user.loginIdPrefix = "+91";
            user.loginIdPrefix = this.LoginWithphone.get('CountryCode').value.toString();
            if (this.IsUserFromSignup == true) {
                user.loginId = this.signupwithphone.get('PhoneNumber').value.toString();
                user.loginType = 0;
            } else {
                user.loginId = this.LoginWithphone.get('PhoneNumber').value.toString();
                user.loginIdPrefix = this.LoginWithphone.get('CountryCode').value.toString();
                user.loginType = 0;
            }
            this._authService.verifyOtp(user).subscribe(response => {
                if (response) {
                    self._dataGuardService.setLocalData('accessToken', JSON.stringify(response.token).replace(/"/g, ''));
                    self._dataGuardService.setLocalData('refreshToken', JSON.stringify(response.refreshToken).replace(/"/g, ''));
                    this.RoleId = this._helperservice.getUserDetail();
                    localStorage.setItem('studentName', this.RoleId.Name);
                    // this.NavigationByRole();
                    this.LoadMore();
                }
            }, (error) => {
                if (error) {
                    this.OtpErrorMessage = error.error.exception;
                    setTimeout(() => {
                        this.OtpErrorMessage = '';
                    }, 5000);
                }

            }
            )
        }
    }
    signinWithEmailPassword() {
        var self = this;
        if (this.signInWithEmailPassword.invalid) {
            this.IssignUppasswordHasError = true;
            return;
        }

        let user = {
            Email: this.signInWithEmailPassword.value.email,
            Password: this.signInWithEmailPassword.value.Password
        };

        // Sign in
        this._authService.signIn(user)
            .subscribe(
                (response) => {

                    //  console.log(response)
                    if (response) {
                        self._dataGuardService.setLocalData('accessToken', JSON.stringify(response.token).replace(/"/g, ''));
                        self._dataGuardService.setLocalData('refreshToken', JSON.stringify(response.refreshToken).replace(/"/g, ''));
                        this.RoleId = this._helperservice.getUserDetail();
                        localStorage.setItem('studentName', this.RoleId.Name);
                        // this.NavigationByRole();
                        this.LoadMore();
                    }
                }, (error) => {

                    if (error.status == 404) {
                        this.signInErrorMessage = error.error.exception;
                        setTimeout(() => {
                            this.signInErrorMessage = '';
                        }, 5000);
                    }
                    this._errohendling.SignUphandleError(error);
                }
            )

    }
    //Function for Otp Feild
    onInputChange(currentInput: HTMLInputElement, nextInput?: HTMLInputElement): void {
        const currentValue = currentInput.value;
        const maxLength = 1; // Set the maximum allowed length for each input field

        if (currentValue.length > maxLength) {
            currentInput.value = currentValue.substr(currentValue.length - 1);
        }

        // Update the corresponding control value
        const control = currentInput.getAttribute('formControlName');
        if (control) {
            this.OtpForm.controls[control].setValue(currentInput.value);
        }

        if (currentValue.length === maxLength && nextInput) {
            nextInput.focus();
        }
    }

    onKeyDown(event: KeyboardEvent, currentInput: HTMLInputElement, previousInput?: HTMLInputElement): void {
        const currentValue = currentInput.value;

        if (event.key === 'Backspace' && currentValue.length === 0 && previousInput) {
            previousInput.value = '';
            previousInput.focus();

            // Update the corresponding control value
            const control = previousInput.getAttribute('formControlName');
            if (control) {
                this.OtpForm.controls[control].setValue('');
            }
        }
    }
    //Otp Function End 
    gotoRegistration() {
        this.IsuserVerified = true;
    }
    LoadMore() {
        
        let token = this._dataGuardService.getLocalData('accessToken');
        if(token){
            this._signalRService.connect();
        }
        this._router.navigate(['/dashboard']);
        let userDetails = this._helperservice.getUserDetail();
        this._CommanService.getCoursesByUserId(userDetails?.Id).subscribe((res: any) => {
            if (res) {
                this.CourseDetails = res;
                var courseid = this.CourseDetails[0]?.courseId;
                if (courseid) {
                    this.storecourselocal(courseid)
                }
                else {
                    this._router.navigate(['/all-course']);
                }
                // console.log(this.CourseDetails)
            }
        }, (error) => {
            this.errorhandling.SignUphandleError(error);
        }
        );
    }

    storecourselocal(id) {
        var localCourse = this._dataGuardService.getCourseId();
        if (localCourse) {
            this.NavigationByRole();
        } else {
            this._dataGuardService.setCourseId('Courseid', id);
            this.NavigationByRole();
        }
    }
    //vanigation by roles 
    NavigationByRole() {
        let redirect = this._route.snapshot.queryParams.redirectURL
            // let redirect = res.redirectURL
            if(redirect?.length > 0){
                this._router.navigate([redirect]);
            }else if (this.RoleId) {
           
            if (this.RoleId.Roles == "Admin") {
                // this._router.navigate(['/dashboard']);
                this._router.navigate(['/communication/home']);
            }
            if (this.RoleId.Roles == "Lecturer") {
                this._router.navigate(['/dashboard/lecturer-dashboard']);
            }
            if (this.RoleId.Roles == "Student") {
                if (this.IsUserFromSignup == true) {
                    this._router.navigate(['/student/student-profile']);
                }
                else {
                    this._router.navigate(['/communication/home']);
                }


            }
        }
    }

    // for both mobile and email by harsh

    onInputChangeForMobileAndEmail(currentInput: HTMLInputElement, nextInput?: HTMLInputElement): void {
        const currentValue = currentInput.value;
        const maxLength = 1; // Set the maximum allowed length for each input field

        if (currentValue.length > maxLength) {
            currentInput.value = currentValue.substr(currentValue.length - 1);
        }

        // Update the corresponding control value
        const control = currentInput.getAttribute('formControlName');

        // Check if control is part of phoneOtpGroup or emailOtpGroup
        if (control) {
            if (['Otp9', 'Otp10', 'Otp11', 'Otp12'].includes(control)) {
                // Part of phoneOtpGroup
                this.OtpFormForloginWithPhoneAndEmail.get('phoneOtpGroup')?.get(control)?.setValue(currentInput.value);
            } else if (['Otp5', 'Otp6', 'Otp7', 'Otp8'].includes(control)) {
                // Part of emailOtpGroup
                this.OtpFormForloginWithPhoneAndEmail.get('emailOtpGroup')?.get(control)?.setValue(currentInput.value);
            }
        }

        if (currentValue.length === maxLength && nextInput) {
            nextInput.focus();
        }
        // Update the validation status of the form
        this.OtpFormForloginWithPhoneAndEmail.get('phoneOtpGroup').updateValueAndValidity();
        this.OtpFormForloginWithPhoneAndEmail.get('emailOtpGroup').updateValueAndValidity();
    }

    onKeyDownForMobileAndEmail(event: KeyboardEvent, currentInput: HTMLInputElement, previousInput?: HTMLInputElement): void {
        const currentValue = currentInput.value;

        if (event.key === 'Backspace' && currentValue.length === 0 && previousInput) {
            previousInput.value = '';
            previousInput.focus();

            // Update the corresponding control value
            const control = previousInput.getAttribute('formControlName');

            if (control) {
                // Check if the control belongs to emailOtpGroup or phoneOtpGroup
                if (this.OtpFormForloginWithPhoneAndEmail.get(`emailOtpGroup.${control}`)) {
                    // Clear value in emailOtpGroup
                    this.OtpFormForloginWithPhoneAndEmail.get(`emailOtpGroup.${control}`)?.setValue('');


                } else if (this.OtpFormForloginWithPhoneAndEmail.get(`phoneOtpGroup.${control}`)) {
                    // Clear value in phoneOtpGroup
                    this.OtpFormForloginWithPhoneAndEmail.get(`phoneOtpGroup.${control}`)?.setValue('');


                }
            }
        }
    }

    onPasteForMobileAndEmail(event: ClipboardEvent): void {
        event.preventDefault();

        const clipboardData = event.clipboardData || (window as any).clipboardData;
        const pastedText = clipboardData.getData('text');

        // Extract digits only
        const otpDigits = pastedText.replace(/\D/g, '');

        // Identify which OTP field is being pasted into
        const target = event.target as HTMLInputElement;
        const targetName = target.getAttribute('formControlName');

        // Separate paste handling for Email and Mobile OTP fields
        if (['Otp5', 'Otp6', 'Otp7', 'Otp8'].includes(targetName!)) {
            // Pasting for Email OTP fields
            this.OtpFormForloginWithPhoneAndEmail.get('emailOtpGroup')?.patchValue({
                Otp5: otpDigits.charAt(0) || '',
                Otp6: otpDigits.charAt(1) || '',
                Otp7: otpDigits.charAt(2) || '',
                Otp8: otpDigits.charAt(3) || ''

            });

            // Trigger input change events for Email OTP fields
            this.onInputChangeForMobileAndEmail(this.otp5Input.nativeElement, this.otp6Input.nativeElement);
            this.onInputChangeForMobileAndEmail(this.otp6Input.nativeElement, this.otp7Input.nativeElement);
            this.onInputChangeForMobileAndEmail(this.otp7Input.nativeElement, this.otp8Input.nativeElement);
        } else if (['Otp9', 'Otp10', 'Otp11', 'Otp12'].includes(targetName!)) {
            // Pasting for Mobile OTP fields
            this.OtpFormForloginWithPhoneAndEmail.get('phoneOtpGroup')?.patchValue({
                Otp9: otpDigits.charAt(0) || '',
                Otp10: otpDigits.charAt(1) || '',
                Otp11: otpDigits.charAt(2) || '',
                Otp12: otpDigits.charAt(3) || ''
            });

            // Trigger input change events for Mobile OTP fields
            this.onInputChangeForMobileAndEmail(this.otp9Input.nativeElement, this.otp10Input.nativeElement);
            this.onInputChangeForMobileAndEmail(this.otp10Input.nativeElement, this.otp11Input.nativeElement);
            this.onInputChangeForMobileAndEmail(this.otp11Input.nativeElement, this.otp12Input.nativeElement);
        }

        // Mark the form controls as touched to trigger validation
        this.OtpFormForloginWithPhoneAndEmail.markAllAsTouched();

    }
    onVerifyOtp() {


        if (this.isIndianNumber) {
            // For Indian numbers, check if the entire form is invalid
            if (this.OtpFormForloginWithPhoneAndEmail.invalid) {
                this.OtpFormForloginWithPhoneAndEmail.markAllAsTouched();
                return;
            }
        } else {
            // For foreign numbers, validate only the email OTP fields
            const emailOtpGroup = this.OtpFormForloginWithPhoneAndEmail.get('emailOtpGroup');
            if (emailOtpGroup?.invalid) {
                emailOtpGroup.markAllAsTouched();
                return;
            }
        }


        // Combine OTP values for email into a single string
        // Combine OTP values for email into a single string
        const emailOtp = `${this.OtpFormForloginWithPhoneAndEmail.get('emailOtpGroup.Otp5')?.value || ''}` +
            `${this.OtpFormForloginWithPhoneAndEmail.get('emailOtpGroup.Otp6')?.value || ''}` +
            `${this.OtpFormForloginWithPhoneAndEmail.get('emailOtpGroup.Otp7')?.value || ''}` +
            `${this.OtpFormForloginWithPhoneAndEmail.get('emailOtpGroup.Otp8')?.value || ''}`;

        // Combine OTP values for mobile into a single string
        const mobileOtp = `${this.OtpFormForloginWithPhoneAndEmail.get('phoneOtpGroup.Otp9')?.value || ''}` +
            `${this.OtpFormForloginWithPhoneAndEmail.get('phoneOtpGroup.Otp10')?.value || ''}` +
            `${this.OtpFormForloginWithPhoneAndEmail.get('phoneOtpGroup.Otp11')?.value || ''}` +
            `${this.OtpFormForloginWithPhoneAndEmail.get('phoneOtpGroup.Otp12')?.value || ''}`;

        // Log the concatenated OTP values

        // Create an object for the OTP request
        let otpRequest: any = {
            countryCode: this.selectedCountryCodeForVerification,
            name: this.userName
        };

        if (this.OTPLoginType === 'email') {
            // If login type is email, send only the email OTP
            otpRequest.phone = this.OTPLoginPhoneType; // Include phone number
            otpRequest.email = this.OTPLoginType;

            otpRequest.emailOtp = Number(emailOtp);

            otpRequest.phoneOtp = 0;  // Set phoneOtp to 0 by default

        } else {
            // If login type is not email, send both email and mobile OTP
            otpRequest.phone = this.OTPLoginPhoneType;
            otpRequest.email = this.OTPLoginType;
            otpRequest.phoneOtp = Number(mobileOtp);
            otpRequest.emailOtp = Number(emailOtp);

        }
        this._authService.verifyOtpForPhoneAndEmail(otpRequest).subscribe(
            (response) => {
                // Handle the response if OTP verification is successful
                if (response) {
                    // Save tokens and user details locally
                    this._dataGuardService.setLocalData('accessToken', JSON.stringify(response.token).replace(/"/g, ''));
                    this._dataGuardService.setLocalData('refreshToken', JSON.stringify(response.refreshToken).replace(/"/g, ''));
                    this.RoleId = this._helperservice.getUserDetail();
                    localStorage.setItem('studentName', this.RoleId.Name);

                    // Additional actions like role-based navigation can be performed here
                    this.LoadMore();
                }
            },
            (error) => {
                // Handle errors and display OTP verification error messages
                if (error) {
                    this.OtpErrorMessage = error.error.exception;
                    setTimeout(() => {
                        this.OtpErrorMessage = '';
                    }, 5000);
                }
            }
        );


    }


    // for both mobile and email ends

}
