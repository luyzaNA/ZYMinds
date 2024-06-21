import {Component, Input} from '@angular/core';
import {faStar} from '@fortawesome/free-solid-svg-icons/faStar';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ProfileService} from "../../services/profile.service";

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent {
  faStar = faStar;

  constructor(private profileService: ProfileService) {
  }

  @Input() rating: number = 0;
  @Input() readonly: boolean = false;
  @Input() userId: string = '';

  setRating(value: number) {
    if (this.readonly) return;
    this.rating = value;
    console.log(this.rating);
    this.profileService.updateRating(this.userId, this.rating).subscribe(response => {});

  }
}
