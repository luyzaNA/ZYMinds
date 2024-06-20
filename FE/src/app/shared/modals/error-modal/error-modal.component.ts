import {Component, OnInit} from '@angular/core';
import {ErrorServiceService} from "../../../services/error-service.service";

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css']
})
export class ErrorModalComponent implements OnInit{
  constructor(private errorService: ErrorServiceService) {
  }
  isVisible: boolean = false;
  errorMessage: string = '';

  ngOnInit() {
    this.errorService.error$.subscribe(error => {
      if(error){
        this.isVisible = true;
        this.errorMessage = error;
      } else {
        this.isVisible = false;
        this.errorMessage = '';
      }
      console.log('Error:', error)
    });
  }

  closeModal() {
    this.errorService.errorSubject.next(null);
  }
}
