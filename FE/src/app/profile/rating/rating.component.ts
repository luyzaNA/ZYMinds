import {Component, Input, OnInit} from '@angular/core';
import {faStar} from '@fortawesome/free-solid-svg-icons/faStar';
import {ProfileService} from "../../services/profile.service";

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements  OnInit{
  faStar = faStar;

  constructor(private profileService: ProfileService) {
  }

  @Input() rating: number = 0;
  @Input() readonly: boolean = false;
  @Input() userId: string = '';

  setRating(value: number) {
    if (this.readonly) return;

    const confirmUpdate = confirm("Sigur vrei să actualizezi evaluarea?");
    if (confirmUpdate) {
      this.rating = value;
      console.log(this.rating);
      this.profileService.updateRating(this.userId, this.rating).subscribe(response => {
        alert("Actualizarea s-a efectuat cu succes");
        this.loadRating()
      });
    }
  }

  ngOnInit() {
    this.loadRating();
  }

  loadRating() {
    console .log("USER ID", this.userId)
    this.profileService.getRating(this.userId).subscribe(response => {
      this.rating = parseFloat(response.ratings.toString());
    });
  }
}
