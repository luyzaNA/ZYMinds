import { Component } from '@angular/core';
import {AuthService} from "./services/auth.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'FE';
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('ro');
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }
}
