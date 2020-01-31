import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AngularMaterialModule } from "../angular-material.module";
import { AuthRoutingMOdule } from "./auth-routing.module";

import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";

@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [AngularMaterialModule, CommonModule, FormsModule, AuthRoutingMOdule]
})
export class AuthModule {}
