import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';

@Component({
  selector: 'app-eye-tracking',
  templateUrl: './eye-tracking.component.html',
  styleUrls: ['./eye-tracking.component.css']
})
export class EyeTrackingComponent {

  @Input() isPassword = false;
  @Output() pupilPositionChanged = new EventEmitter<{ left: number, right: number }>();

  leftPupilPositionX = 30;
  leftPupilPositionY = 70;
  rightPupilPositionX = 30;
  rightPupilPositionY = 70;


  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.updatePupilPosition(event.clientX, event.clientY);
  }

  updatePupilPosition(mouseX: number, mouseY: number) {
    const eyeCenterX = window.innerWidth / 2;
    const eyeCenterY = window.innerHeight / 2;

    const maxMovement = 20;

    const offsetX = ((mouseX - eyeCenterX) / eyeCenterX) * maxMovement;
    const offsetY = ((mouseY - eyeCenterY) / eyeCenterY) * maxMovement;

    this.leftPupilPositionX = 30 + offsetX;
    this.leftPupilPositionY = 70 + offsetY;
    this.rightPupilPositionX = 30 + offsetX;
    this.rightPupilPositionY = 70 + offsetY;

  }


}
