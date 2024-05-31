import {Component} from '@angular/core';
import {User} from "../../shared/user";
import {AuthService} from "../../services/auth.service";
import {NgForm} from "@angular/forms";
import {ProfileService} from "../../services/profile.service";
import {ProfileI} from "../../shared/Profile";
import {UserService} from "../../services/user.service";
import {FileI} from "../../shared/file";
import {FileUploadService} from "../../services/upload.service";
import {Observable} from "rxjs";


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent  {

  currentUser!: User;
  files!: File;
  id = ''
  fileId = '';


  constructor(protected profileService: ProfileService,
              private authService: AuthService,
              private userService: UserService,
              private fileService: FileUploadService) {
    this.currentUser = this.authService.getCurrentUser();
    this.profileService.profileI.userId = this.currentUser.id;

    this.profileService.getProfile(this.currentUser.id).subscribe((profile) => {
      this.profileService.profileI = profile;
    })
    this.fileService.getFiles(this.currentUser.id, "PROFILE").subscribe(
      (response) => {
        this.fileId = response[0]._id;
        this.profileService.photoUrl = response[0].awsLink;
      }
    );

  }


  updateFullName(value: string): void {
    this.currentUser.fullName = value;
  }

  updateAge(value: number) {
    this.profileService.profileI.age = value;
  }

  updateDescription(value: string) {
    this.profileService.profileI.description = value;
  }

  updatePrice(value: number) {
    this.profileService.profileI.price = value;
  }

  updateRating(value: number) {
    this.profileService.profileI.rating = value;
  }

  updatePhoneNumber(value: string) {
    this.currentUser.phoneNumber = value;
  }


  editProfile() {
  //update age description, price, description
    this.profileService.updateProfile(this.profileService.profileI)
      .subscribe((profile) => {
        },
        (error) => {
          console.error('Eroare la actualizarea profilului:', error);
        });


    //update phone number and full name
    this.userService.updateUser(this.currentUser.id, this.currentUser.email,
      this.currentUser.fullName, this.currentUser.phoneNumber, this.currentUser.roles).subscribe(() => {
      },
      (error) => {
        console.error('Eroare la actualizarea profilului:', error);
      })

    this.uploadFile();

    this.fileService.getFiles(this.currentUser.id, "PROFILE").subscribe(
      (response) => {
        this.fileId = response[0]._id;
        this.profileService.photoUrl = response[0].awsLink;
      }
    );


  }

  // updateProfile(createCardForm: NgForm) {
//     this.profileService.updateProfile(this.profileService.profileI).subscribe(() => {
//
//       // this.uploadFile()
//       // console.log(this.currentUser.id)
//
//
//     //   this.fileService.getFiles(this.currentUser.id, "PROFILE").subscribe(
//     //     (response) => {
//     //       this.id=response
//     //     },
//     //     (error) => {
//     //       console.error('Eroare la obținerea linkurilor AWS:', error);
//     //     }
//     //   )
//     }, error => {
//       console.log('Eroare la actualizarea profilului:', error);
//     });
//
//
//
// //pt full name
//     this.userService.updateUser(this.currentUser.id, this.currentUser.email,
//       this.currentUser.fullName, this.currentUser.phoneNumber, this.currentUser.roles).subscribe(() => {
//         console.log(this.currentUser.fullName)
//         console.log("User updated successfully");
//       },
//       (error) => {
//         console.error('Eroare la actualizarea profilului:', error);
//       })
//   }

  fileData: FileI = {
    userId: '',
    awsLink: '',
    filename: '',
    mimetype: '',
    size: 0,
    context: "PROFILE",
    _id: this.fileId
  };


  protected filesUp(files: File) {
    this.files = files;
  }

  private uploadFile() {


    if (this.files) {

      this.fileData.userId = this.currentUser.id;
      this.fileData.awsLink = '';
      this.fileData.filename = this.files.name;
      this.fileData.mimetype = this.files.type;
      this.fileData.size = this.files.size;
      this.fileData.context = "PROFILE"

      // getFiles(userId: string, context: string): Observable<string> {
      //   return this.http.get<string>(`${this.baseUrl}/files/${userId}/${context}`);
      // }
      // this.fileService.getFiles(this.currentUser.id, "PROFILE").subscribe(
      //   (response) =>this.fileId=response);

      console.log("FILE ID E",this.fileId)
      this.fileService.updateFile(this.fileId, this.files, this.fileData).subscribe(
        (response: any) => {
          if(!response.body)
              return;
          console.log("raspunsul din edit e", response)
          this.profileService.photoUrl = response.body.awsLink;
        },
        (error: any) => {
          console.error('Eroare la încărcarea fișierului:', error);
        }
      );
    } else {
      console.error('Nu există fișiere de încărcat.');
    }
  }


}
