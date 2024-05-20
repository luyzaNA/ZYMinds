import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent {

  moveTo(id:string){
    const el=document.getElementById(id);
    if(el) {
      el.scrollIntoView({behavior: 'smooth'});
    }
    else return;
  }}
