import {Component} from '@angular/core';
import {FileUploadService} from "../../services/upload.service";
import {UserService} from "../../shared/User/user.service";
import {User} from "../../shared/User/UserI";

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent {
  user: User = new User();
  awsLinks: string[] = [];
  newPossibleCoaches: User[] = new Array<User>();
  users: User[] = new Array<User>();

  constructor(private fileService: FileUploadService,
              private userService: UserService) {
    this.user =new User();
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getAllUser().subscribe({
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

    this.userService.updateUserStatus(this.user, false).subscribe(
      (response: Object) => {
        console.log(response);
      },
      (error: any) => {
        console.error('Cannot set user');
      })
    console.log("USER ID UL E", this.user.id);

    this.awsLinks = [];

    this.fileService.getFiles(this.user.id, "CERTIFICATE").subscribe(
      (response) => {
        if (Array.isArray(response)) {
          response.forEach((file: any) => {
            console.log(file.awsLink);
            this.awsLinks.push(file.awsLink);
          });
        } else {
          console.error('Răspunsul de la server nu este un array:', response);
        }
      },
      (error) => {
        console.error('Eroare la obținerea linkurilor AWS:', error);
      });
  }

  updateRecords() {
    this.userService.updateUser(this.user.id, this.user.email,
      this.user.fullName, this.user.phoneNumber,
      this.user.roles).subscribe(
      (resultUser: Object) => {
        console.log(resultUser);
        this.getAllUsers();
      },
      (error) => {
        console.error('Eroare la cererea PATCH:', error);
      });
  }

  setDelete(id: string): void {
    this.userService.deleteUser(id).subscribe(
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
