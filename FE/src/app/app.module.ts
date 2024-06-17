import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {RegisterComponent} from './auth/register/register.component';
import {LoginComponent} from './auth/login/login.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule, provideHttpClient, withInterceptors} from '@angular/common/http';
import {FileUploaderComponent} from './auth/register/file-uploader/file-uploader.component';
import {HomeComponent} from "./first-page/home/home-component";
import {UserManagementComponent} from './admin/user-management/user-management.component';
import {NavigationBarComponent} from './first-page/navigation-bar/navigation-bar.component';
import {ContactSectionComponent} from './first-page/contact-section/contact-section.component';
import {AboutUsComponent} from './first-page/about-us/about-us.component';
import {RouterModule} from "@angular/router";
import {CoachCardComponent} from './coach/coach-card/coach-card.component';
import {NgOptimizedImage} from "@angular/common";
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {AppRoutingModule} from "./app-routing.module";
import {CoachDashboardComponent} from './coach/coach-dashboard/coach-dashboard.component';
import {ClientsComponent} from './coach/clients/clients.component';
import {MenuComponent} from './menu/menu.component';
import {ClientDashbordComponent} from './Client/client-dashbord/client-dashbord.component';
import {ProfileComponent} from './profile/profile.component';
import {MenuDetailsComponent} from './menu/menu-details/menu-details.component';
import {CustomInterceptor} from './services/custom.interceptor';
import { ConversationComponent } from './conversation/conversation.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { CoachListComponent } from './coach/coach-list/coach-list.component';
import { RatingComponent } from './profile/rating/rating.component'
import { FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import { EyeTrackingComponent } from './auth/eye-tracking/eye-tracking.component';
import { PrerequisitesComponent } from './menu/prerequisites/prerequisites.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    FileUploaderComponent,
    HomeComponent,
    UserManagementComponent,
    NavigationBarComponent,
    ContactSectionComponent,
    AboutUsComponent,
    CoachCardComponent,
    PageNotFoundComponent,
    CoachDashboardComponent,
    ClientsComponent,
    MenuComponent,
    ClientDashbordComponent,
    ProfileComponent,
    MenuDetailsComponent,
    ConversationComponent,
    EditProfileComponent,
    CoachListComponent,
    RatingComponent,
    EyeTrackingComponent,
    PrerequisitesComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NgOptimizedImage,
    AppRoutingModule,
    FontAwesomeModule
  ],
  providers: [ provideHttpClient(withInterceptors([CustomInterceptor]))],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule {
}
