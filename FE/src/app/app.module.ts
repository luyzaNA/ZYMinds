import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { FileUploaderComponent } from './auth/register/file-uploader/file-uploader.component';
import {HomeComponent} from "./first-page/first-component/home-component";
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { NavigationBarComponent } from './first-page/navigation-bar/navigation-bar.component';
import { ContactSectionComponent } from './first-page/contact-section/contact-section.component';
import { AboutUsComponent } from './first-page/about-us/about-us.component';
import {RouterModule, Routes} from "@angular/router";
import { CreateCoachCardComponent } from './coach/create-coach-card/create-coach-card.component';
import { CoachCardComponent } from './coach/coach-card/coach-card.component';
import {NgOptimizedImage} from "@angular/common";
import {CoachCardService} from "./services/coach-card.service";
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {AppRoutingModule} from "./app-routing.module";
import { CoachDashboardComponent } from './coach/coach-dashboard/coach-dashboard.component';
import { ClientsComponent } from './coach/clients/clients.component';
import { MenuComponent } from './menu/menu.component';
import { ClientDashbordComponent } from './Client/client-dashbord/client-dashbord.component';
import { ProfileComponent } from './profile/profile.component';

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
    CreateCoachCardComponent,
    CoachCardComponent,
    PageNotFoundComponent,
    CoachDashboardComponent,
    ClientsComponent,
    MenuComponent,
    ClientDashbordComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NgOptimizedImage,
    AppRoutingModule
  ],
  providers: [CoachCardService],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppModule { }
