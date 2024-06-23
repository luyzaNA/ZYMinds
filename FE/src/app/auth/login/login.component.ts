import {Component} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  isPasswordFocused = false;

  constructor(private authService: AuthService,
              private router: Router) {}

  onFocus(isPassword: boolean) {
    this.isPasswordFocused = isPassword;
  }

  onBlur() {
    this.isPasswordFocused = false;
  }

  login(email: string, password: string): void {
    this.authService.loginUser(email, password).subscribe(
      user => {
        if (user.roles === 'COACH') {
          this.router.navigate(['coach/dashboard']);
        } else if (user.roles === 'CLIENT')
          this.router.navigate(['client/dashboard']);
        else if (user.roles === 'ADMIN')
          this.router.navigate(['admin/management-clients']);

      },
      error => {
        console.error('Login failed:', error);
      }
    );
  }
}
