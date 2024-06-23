import {Component} from '@angular/core';
import {ProfileService} from "../../services/profile.service";
import {UserService} from "../../shared/User/user.service";
import {FileUploadService} from "../../services/upload.service";
import {ProfileInformation} from "../../shared/ProfileInformation/ProfileInformationI";

@Component({
  selector: 'app-coach-list',
  templateUrl: './coach-list.component.html',
  styleUrls: ['./coach-list.component.css']
})
export class CoachListComponent {
  profile :ProfileInformation = new ProfileInformation();

  usersInfo: ProfileInformation[] = [];
  constructor(private profileService: ProfileService,
              private userService: UserService,
              private fileService:  FileUploadService) {
    this.initialize()
  }

  initialize(): void {
    this.profileService.getProfiles().subscribe(
      (profiles) => {
        profiles.forEach((profile) => {
          this.userService.getUserById(profile.userId).subscribe(
            (user) => {
              this.fileService.getFiles(user.id, "PROFILE").subscribe(
                (files) => {
                  const photoUrl = files.length > 0 ? files[0].awsLink : 'defaultPhotoUrl'; // Use a default photo URL if no files found

                  const userInformation: ProfileInformation = {
                    email: user.email,
                    fullName: user.fullName,
                    phoneNumber: user.phoneNumber,
                    description: profile.description,
                    age: profile.age,
                    price: profile.price,
                    userId: user.id,
                    rating: profile.rating,
                    awsLink: photoUrl,
                    id: '',
                    statusApplication: ''
                  };
                  this.usersInfo.push(userInformation);
                },
                (error) => {
                  console.error('Eroare la obținerea fișierelor:', error);
                }
              );
            },
            (error) => {
              console.error('Eroare la obținerea utilizatorului:', error);
            }
          );
        });
      },
      (error) => {
        console.error('Eroare la obținerea profilurilor:', error);
      }
    );
  }
}
