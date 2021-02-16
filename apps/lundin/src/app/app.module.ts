import { HttpClientModule } from "@angular/common/http"
import { NgModule } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { BrowserModule } from "@angular/platform-browser"
import { AppRoutingModule } from "./app-routing.module"
import { OverlayHostDirective } from "./directives/overlay-host.directive"
import { AppComponent } from "./main-component/app.component"
import { AncestryModule } from "./modules/ancestry/ancestry.module"
import { CalendarModule } from "./modules/calendar/calendar.module"
import { CryptModule } from "./modules/crypt/crypt.module"
import { GalleryModule } from "./modules/gallery/gallery.module"
import { MessageModule } from "./modules/message/message.module"
import { MinestrygerModule } from "./modules/minestryger/minestryger.module"
import { NoughtsAndCrossesModule } from "./modules/noughts-and-crosses/noughts-and-crosses.module"
import { VirusModule } from "./modules/virus/virus.module"
import { AncestryComponent } from "./pages/ancestry/ancestry.component"
import { CalendarComponent } from "./pages/calendar/calendar.component"
import { HomeComponent } from "./pages/home/home.component"
import { IframeGameComponent } from "./pages/iframe-game/iframe-game.component"
import { LoginComponent } from "./pages/login/login.component"
import { ProfileComponent } from "./pages/profile/profile.component"
import { RecipesComponent } from "./pages/recipes/recipes.component"
import { VariousComponent } from "./pages/various/various.component"
import { AuthService } from "./services/auth.service"
import { IsAuthenticatedGuard } from "./services/is-authenticated.guard"
import { NavigationService } from "./services/navigation.service"
import { UserService } from "./services/user.service"
import { SharedModule } from "./shared/shared.module"

@NgModule({
	declarations: [
		AncestryComponent,
		AppComponent,
		CalendarComponent,
		HomeComponent,
		IframeGameComponent,
		LoginComponent,
		ProfileComponent,
		RecipesComponent,
		VariousComponent,
		OverlayHostDirective,
	],
	imports: [
		AncestryModule,
		AppRoutingModule,
		BrowserModule,
		CalendarModule,
		CryptModule,
		FormsModule,
		GalleryModule,
		HttpClientModule,
		MessageModule,
		MinestrygerModule,
		NoughtsAndCrossesModule,
		SharedModule,
		VirusModule,
	],
	providers: [
		AuthService,
		IsAuthenticatedGuard,
		NavigationService,
		UserService
	],
	bootstrap: [AppComponent],
})
export class AppModule { }
