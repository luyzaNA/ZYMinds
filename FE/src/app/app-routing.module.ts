import {RouterModule, Routes} from "@angular/router";
import  {NgModule} from "@angular/core";
import {LoginComponent} from "./auth/login/login.component";
import {HomeComponent} from "./first-page/first-component/home-component";
import {AboutUsComponent} from "./first-page/about-us/about-us.component";
import {CreateCoachCardComponent} from "./coach/create-coach-card/create-coach-card.component";
import {ContactSectionComponent} from "./first-page/contact-section/contact-section.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {RegisterComponent} from "./auth/register/register.component";
import {UserManagementComponent} from "./admin/user-management/user-management.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'first-page', component: HomeComponent, children:[
      {path: 'aboutUs', component: AboutUsComponent}
    ]},
  { path: 'create-card', component: CreateCoachCardComponent},
  {path: 'contact', component: ContactSectionComponent},
  {path: 'management-clients', component: UserManagementComponent},
  {path: 'page-not-found', component: PageNotFoundComponent},
  {path: '**', redirectTo: 'page-not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
