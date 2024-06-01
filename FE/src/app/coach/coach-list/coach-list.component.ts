import {Component, Input} from '@angular/core';
import {ProfileService} from "../../services/profile.service";
import {Observable} from "rxjs";
import {environment} from "../../shared/environment";
import {UserService} from "../../services/user.service";
import {UserInformation} from "../../shared/user";
import {FileUploadService} from "../../services/upload.service";

@Component({
  selector: 'app-coach-list',
  templateUrl: './coach-list.component.html',
  styleUrls: ['./coach-list.component.css']
})
export class CoachListComponent {
  profile! :{name:string, phone:string, age:number, price:number,
  description:string, rating:number, photoUrl:string, userId:string};

  users: UserInformation[] = [];
  constructor(private profileService: ProfileService,
              private userService: UserService,
              private fileService:  FileUploadService) {
    this.initialize()
    console.log(this.users)
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

                  const userInformation: UserInformation = {
                    email: user.email,
                    fullName: user.fullName,
                    phoneNumber: user.phoneNumber,
                    description: profile.description,
                    age: profile.age,
                    price: profile.price,
                    userId: user.id,
                    rating: profile.rating,
                    photoUrl: photoUrl,
                  };
                  this.users.push(userInformation);
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
