import {RouterModule, Routes, ExtraOptions} from "@angular/router";
import {NgModule} from "@angular/core";
import {LoginComponent} from "./auth/login/login.component";
import {AboutUsComponent} from "./first-page/about-us/about-us.component";
import {ContactSectionComponent} from "./first-page/contact-section/contact-section.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {RegisterComponent} from "./auth/register/register.component";
import {UserManagementComponent} from "./admin/user-management/user-management.component";
import {RoleGuard} from "./services/auth.guard.service";
import {CoachDashboardComponent} from "./coach/coach-dashboard/coach-dashboard.component";
import {ClientsComponent} from "./coach/clients/clients.component";
import {MenuComponent} from "./menu/menu.component";
import {ClientDashbordComponent} from "./Client/client-dashbord/client-dashbord.component";
import {ProfileComponent} from "./profile/profile.component";
import {MenuDetailsComponent} from "./menu/menu-details/menu-details.component";
import {ConversationComponent} from "./conversation/conversation.component";
import {EditProfileComponent} from "./profile/edit-profile/edit-profile.component";
import {CoachListComponent} from "./coach/coach-list/coach-list.component";
import {HomeComponent} from "./first-page/home/home-component";

const routes: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {
    path: 'first-page', component: HomeComponent, children: [
      {path: 'aboutUs', component: AboutUsComponent},
      {path: 'contact', component: ContactSectionComponent}
    ]
  },
  {path: 'coach-list', component: CoachListComponent},
  {
    path: 'coach', canActivate: [RoleGuard], data: {expectedRole: 'COACH'}, children: [
      {path: 'dashboard', component: CoachDashboardComponent},
      {path: 'clients', component: ClientsComponent},
      {path: 'conversation/:id', component: ConversationComponent},
      {
        path: 'menus/:id', component: MenuComponent, children: [
          {path: 'menu-details', component: MenuDetailsComponent}
        ]
      },
      {path: 'profile', component: ProfileComponent},
      {path: 'edit-profile', component: EditProfileComponent},
    ]
  },
  {
    path: 'client', canActivate: [RoleGuard], data: {expectedRole: 'CLIENT'}, children: [
      {path: 'dashboard', component: ClientDashbordComponent},
      {
        path: 'menus/:id', component: MenuComponent, children: [
          {path: 'menu-details', component: MenuDetailsComponent}
        ]
      },
      {path: 'profile', component: ProfileComponent},
      {path: 'edit-profile', component: EditProfileComponent},
      {path: 'conversation/:id', component: ConversationComponent},
    ]
  },
  {path: 'contact', component: ContactSectionComponent},
  {
    path: 'admin', canActivate: [RoleGuard], data: {expectedRole: 'ADMIN'}, children: [
      {path: 'management-clients', component: UserManagementComponent},
    ]
  },
  {path: 'page-not-found', component: PageNotFoundComponent},
  {path: '**', redirectTo: 'page-not-found'}
];

const routerOptions: ExtraOptions = {
  anchorScrolling: 'enabled',
  scrollPositionRestoration: 'enabled',
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
