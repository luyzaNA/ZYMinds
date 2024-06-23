import {Component} from '@angular/core';
import {PrerequisitesService} from "../shared/Prerequisites/prerequisites.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  noPrerequisites: boolean = false;
  constructor(private prerequisitesService: PrerequisitesService, private route: ActivatedRoute){
    this.getPrerequisitesSet();
  }
  linkId!: string;

  getPrerequisitesSet() {
    this.linkId = this.route.snapshot.paramMap.get('id')!;
    this.prerequisitesService.getPrerequisitesByLink(this.linkId).subscribe(
      (response) => {
        if (!response) {
          this.noPrerequisites = true;
        }
      },
      (error) => {
        this.noPrerequisites = true;
      })
  }
}
