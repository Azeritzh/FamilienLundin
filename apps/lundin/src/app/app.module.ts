import { HttpClientModule } from "@angular/common/http"
import { NgModule } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { BrowserModule } from "@angular/platform-browser"
import { AppRoutingModule } from "./app-routing.module"
import { OverlayHostDirective } from "./directives/overlay-host.directive"
import { AppComponent } from "./main-component/app.component"
import { CalendarModule } from "./modules/calendar/calendar.module"
import { CryptModule } from "./modules/crypt/crypt.module"
import { MessageModule } from "./modules/message/message.module"
import { NoughtsAndCrossesModule } from "./modules/noughts-and-crosses/noughts-and-crosses.module"
import { AncestryComponent } from "./pages/ancestry/ancestry.component"
import { CalendarComponent } from "./pages/calendar/calendar.component"
import { GalleryComponent } from "./pages/gallery/gallery.component"
import { HomeComponent } from "./pages/home/home.component"
import { LoginComponent } from "./pages/login/login.component"
import { ProfileComponent } from "./pages/profile/profile.component"
import { RecipesComponent } from "./pages/recipes/recipes.component"
import { VariousComponent } from "./pages/various/various.component"
import { AuthService } from "./services/auth.service"
import { NavigationService } from "./services/navigation.service"
import { UserService } from "./services/user.service"

@NgModule({
	declarations: [
		AncestryComponent,
		AppComponent,
		CalendarComponent,
		GalleryComponent,
		HomeComponent,
		LoginComponent,
		ProfileComponent,
		RecipesComponent,
		VariousComponent,
		OverlayHostDirective,
	],
	imports: [
		AppRoutingModule,
		BrowserModule,
		CalendarModule,
		CryptModule,
		FormsModule,
		HttpClientModule,
		MessageModule,
		NoughtsAndCrossesModule,
	],
	providers: [AuthService, NavigationService, UserService],
	bootstrap: [AppComponent],
})
export class AppModule { }
