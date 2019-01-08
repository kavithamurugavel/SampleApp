import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { validateConfig } from '@angular/router/src/config';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { User } from '../_models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // @Input() valuesFromHome: any; // @Input is to make use of properties from parent to child

  // To make use of child component properties in the parent (using @Output)
  // the four parts are: 1) Make use of @Output() decorator in the child component 2) emit the property that we need in the child component
  // 3) head over to the parent html and add the output property with parentheses and the corresponding parent method with $event
  // 4) Define that method in the parent component - explained again in Section 11, Lecture 113
  @Output() cancelRegister = new EventEmitter(); // @Output is to emit properties from child to parent
  user: User;

  registerForm: FormGroup;

  // following is to get the red color theme for the datepicker control
  // https://valor-software.com/ngx-bootstrap/#/datepicker#themes
  // we give this as a partial class so that we don't have to define all the bsconfig params
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(private authService: AuthService, private alertify: AlertifyService, private fb: FormBuilder,
    private router: Router) { }

  ngOnInit() {
    // this.registerForm = new FormGroup({
    //   username: new FormControl('', Validators.required),
    //   password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
    //   confirmPassword: new FormControl('', Validators.required)
    // }, this.passwordMatchValidator);
    this.bsConfig = {
      containerClass: 'theme-red'
    },
    this.createRegisterForm();
  }

  // same as commented lines above done with FormBuilder
  createRegisterForm() {
    this.registerForm = this.fb.group({
      // radio button with default male so that the user is forced to choose, since we really can't validate radio buttons
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {validator: this.passwordMatchValidator});
  }

  // custom validator
  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value ? null : {'mismatch': true};
  }

  register() {
    if (this.registerForm.valid) {
      // getting the values from the form and passing it to the user object
      // Object.assign clones the object from registerForm and assigns it to the empty object,
      // which in turn is set to the user object
      this.user = Object.assign({}, this.registerForm.value);
      this.authService.register(this.user).subscribe(() => {
        this.alertify.success('Registration successful.');
      }, error => {
        this.alertify.error(error);
      }, () => {
        // this is the 'complete' step. Upon completion we redirect the user to the members page
        this.authService.login(this.user).subscribe(() => {
          this.router.navigate(['/members']);
        });
      });
    }
    // this.authService.register(this.model).subscribe(() => {
    //   this.alertify.success('Registration Successful');
    // }, error => {
    //   this.alertify.error('Error');
    // });
  }

  cancel() {
    this.cancelRegister.emit(false); // simple example
  }

}
