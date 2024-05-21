import {Component, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {User} from "../../shared/user";
import {FileUploadService} from "../../services/upload.service";
import {FileI} from "../../shared/file";
import {AdminService} from "../../services/admin.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  @ViewChild('singUpForm') form!: NgForm;

  files!: File[];
  private userId: string = '';
  selectedRole: boolean = false;

  userData: User = {
    email: '',
    fullName: '',
    phoneNumber: 0,
    password: '',
    newCoach: false,
    roles: '',
    id: ''
  };

  constructor(private authService: AuthService,
              private fileService: FileUploadService,
              private adminService: AdminService) {
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
          size: file.size
        };

        this.fileService.uploadFile(file, fileData).subscribe(
          (response: any) => {
            this.adminService.updateUserStatus(this.userData, true).subscribe(
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
          this.userId = response;
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
