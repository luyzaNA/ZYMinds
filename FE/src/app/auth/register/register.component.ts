import {Component, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {FileUploadService} from "../../services/upload.service";
import {FileI} from "../../shared/file";
import {UserService} from "../../shared/User/user.service";
import {User} from "../../shared/User/UserI";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  @ViewChild('signUpForm') form!: NgForm;

  files!: File[];
  private userId: string = '';
  selectedRole: boolean = false;
  isPasswordFocused = false;

  onFocus(isPassword: boolean) {
    this.isPasswordFocused = isPassword;
  }

  onBlur() {
    this.isPasswordFocused = false;
  }
  userData: User = new User()

  constructor(private authService: AuthService,
              private fileService: FileUploadService,
              private userService: UserService,
              private router: Router
              ) {
  }

  protected filesUp(files: File[]) {
    this.files = files;
  }

  private uploadFiles() {
    if (this.files) {
      this.files.forEach((file) => {
        const fileData: FileI = {
          userId: this.userId,
          awsLink: '',
          filename: file.name,
          mimetype: file.type,
          size: file.size,
          context: "CERTIFICATE",
          _id: ''
        };

        this.fileService.uploadFile(file, fileData).subscribe(
          (response: any) => {
            this.userService.updateUserStatus(this.userData, true).subscribe(
              (response: Object) => {
                console.log(
                  "AICI INTRA si user id ", this.userData.id
                );
              },
              (error: any) => {
                console.log("Cannot update user status", error);
              }
            );
          },
          (error: any) => {
            console.error('Eroare la încărcarea fișierului:', error);
          }
        );
      });
    } else {
      console.error('Nu există fișiere de încărcat.');
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.userData.email = this.form.value.userData.email,
        this.userData.fullName = this.form.value.userData.fullName,
        this.userData.phoneNumber = this.form.value.userData.phoneNumber,
        this.userData.password = this.form.value.userData.password,
        this.userData.roles = this.form.value.roles,
        this.userData.newCoach = false

      this.authService.registerUser(this.userData).subscribe({
        next: (response) => {
          this.authService.getCurrentUser().subscribe(user => {
            this.userId = user.id
            if(user.roles === 'COACH') {
              this.router.navigate(['/coach/dashboard']);
            } else if (user.roles === 'CLIENT') {
              this.router.navigate(['/client/dashboard']);
            }
          });
          this.userData.id = this.userId;
          console.log("USER ID", this.userId);
          this.uploadFiles();


          console.log('Răspunsul primit:', response);

        },
        error: (error) => {
          console.error('Eroare la înregistrare:', error);
        }
      });
    } else {
      console.error('Formularul nu este valid.');
    }
  }
}
