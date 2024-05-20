import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { User} from "../../shared/user";
import {FileUploadService} from "../../services/upload.service";
import {AdminService} from "../../services/admin.service";

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent {
  user!:User;

  awsLinks: string[] = [];

  constructor(private http: HttpClient,
              private fileService: FileUploadService,
              private adminService: AdminService) {
    this.user = { email: '', fullName: '', phoneNumber: 0, roles: '', id: '' , password: '', newCoach: false};
    this.getAllUsers();
  }

  newPossibleCoaches: User[] = [];
  users: User[] = [];

  getAllUsers() {
    this.adminService.getAllUser().subscribe({
      next: (resultData) => {
        console.log(resultData);
        this.newPossibleCoaches = resultData.filter((result: { newCoach: boolean; }) => result.newCoach === true);
        this.users = resultData.filter((result: { newCoach: boolean; }) => result.newCoach === false);
      },
      error: (error) => {
        console.error('Cannot get all users');
      }
    })
  }

  setUser(userData: User) {

    this.user.email = userData.email;
    this.user.fullName = userData.fullName;
    this.user.phoneNumber = userData.phoneNumber;
    this.user.roles = userData.roles;
    this.user.id = userData.id;

    this.adminService.updateUserStatus(this.user, false).subscribe(
      (response: Object) => {
        console.log(response);
      },
      (error: any) => {
        console.error('Cannot set user');
      }
    )

    this.awsLinks = [];

    this.fileService.getFile(this.user.id).subscribe(
      (response) => {
        if (Array.isArray(response)) {
          response.forEach((file: any) => {
            this.awsLinks.push(file.awsLink);
          });
        } else {
          console.error('Răspunsul de la server nu este un array:', response);
        }
      },
      (error) => {
        console.error('Eroare la obținerea linkurilor AWS:', error);
      }
    );
  }

  updateRecords() {
    this.adminService.updateUser(this.user).subscribe(
      (resultUser: Object) => {
        console.log(resultUser);
        this.getAllUsers();
      },
      (error) => {
        console.error('Eroare la cererea PATCH:', error);
      });
  }

  setDelete(id: string): void {
      this.adminService.deleteUser(id).subscribe(
        (response) => {
          this.getAllUsers();
          console.log("User deleted successfully", response);
        },
        (error) => {
          console.error("Error deleting user", error);
        }
      );
    }
}
