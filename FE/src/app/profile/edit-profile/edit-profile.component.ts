import { Component } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { ProfileService } from "../../services/profile.service";
import { UserService } from "../../shared/User/user.service";
import { FileI } from "../../shared/file";
import { FileUploadService } from "../../services/upload.service";
import { ProfileI } from "../../shared/Profile";
import {ProfileInformation} from "../../shared/ProfileInformation/ProfileInformationI";
import {User} from "../../shared/User/UserI";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent {

  currentUser:User = new User();
  files!: File;
  fileId = '';
  profile: ProfileI = {
    _id: '',
    age: 0,
    description: '',
    price: 0,
    rating: 0,
    userId: ''
  };

  profileInformation: ProfileInformation = new ProfileInformation();
  constructor(
    protected profileService: ProfileService,
    private authService: AuthService,
    private userService: UserService,
    private fileService: FileUploadService
  ) {
    // Get current user
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      console.log(this.currentUser)
      console.log(this.currentUser.roles)
      console.log(this.currentUser.id)
      this.profileInformation.userId = this.currentUser.id;
      this.profileInformation.fullName = this.currentUser.fullName;
      this.profileInformation.phoneNumber = this.currentUser.phoneNumber;

      // Fetch profile data
    });
console.log("IN EDIT",this.currentUser)
    this.profileInformation.userId = this.currentUser.id;
    this.profileInformation.fullName = this.currentUser.fullName;
    this.profileInformation.phoneNumber = this.currentUser.phoneNumber;

    // Fetch profile data
    this.profileService.getProfile(this.profileInformation.userId).subscribe((profile) => {
        this.profileInformation.description = profile.description;
        this.profileInformation.age = profile.age;
        this.profileInformation.price = profile.price;
        this.profileInformation.rating = profile.rating;
        console.log("descrierea", this.profileInformation.description)

        this.profile._id = profile._id;

        // Fetch files
        this.fileService.getFiles(this.profileInformation.userId, "PROFILE").subscribe(
          (response) => {
            if (response.length > 0) {
              this.fileId = response[0]._id;
              this.profileInformation.awsLink = response[0].awsLink;
            }
          },
          (error) => {
            console.error('Error fetching files:', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching profile:', error);
      });
  }

  updateFullName(value: string): void {
    this.profileInformation.fullName = value;
  }

  updateAge(value: number): void {
    this.profileInformation.age = value;
  }

  updateDescription(value: string): void {
    this.profileInformation.description = value;
  }

  updatePrice(value: number): void {
    this.profileInformation.price = value;
  }

  updateRating(value: number): void {
    this.profileInformation.rating = value;
  }

  updatePhoneNumber(value: string): void {
    this.profileInformation.phoneNumber = value;
  }

  editProfile(): void {
    // Update profile
    this.profile.price = this.profileInformation.price;
    this.profile.rating = this.profileInformation.rating;
    this.profile.age = this.profileInformation.age;
    this.profile.description = this.profileInformation.description;
    this.profile.userId = this.profileInformation.userId;

    this.profileService.updateProfile(this.profile).subscribe(
      () => {
        // Update user information
        console.log("ce vreau sa modific", this.profile)

        this.userService.updateUser(this.profileInformation.userId, this.currentUser.email,
          this.profileInformation.fullName, this.profileInformation.phoneNumber, this.currentUser.roles).subscribe(
          () => {
            this.uploadFile();
          },
          (error) => {
            console.error('Error updating user:', error);
          }
        );
      },
      (error) => {
        console.error('Error updating profile:', error);
      }
    );
  }

  fileData: FileI = {
    userId: '',
    awsLink: '',
    filename: '',
    mimetype: '',
    size: 0,
    context: "PROFILE",
    _id: this.fileId
  };

  protected filesUp(files: File): void {
    this.files = files;
  }

  private uploadFile(): void {
    if (this.files) {
      this.fileData.userId = this.profileInformation.userId;
      this.fileData.filename = this.files.name;
      this.fileData.mimetype = this.files.type;
      this.fileData.size = this.files.size;

      this.fileService.updateFile(this.fileId, this.files, this.fileData).subscribe(
        (response: any) => {
          if (response.body) {
            this.profileInformation.awsLink = response.body.awsLink;
          }
        },
        (error: any) => {
          console.error('Error uploading file:', error);
        }
      );
    } else {
      console.log('No files to upload.'); // Changed from error to log
    }
  }
}
