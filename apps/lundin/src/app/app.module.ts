import { HttpClientModule } from "@angular/common/http"
import { NgModule } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { BrowserModule } from "@angular/platform-browser"
import { AppRoutingModule } from "./app-routing.module"
import { AuthService } from "./auth/auth.service"
import { AppComponent } from "./main-component/app.component"
import { CryptModule } from "./modules/crypt/crypt.module"
import { AncestryComponent } from "./pages/ancestry/ancestry.component"
import { CalendarComponent } from "./pages/calendar/calendar.component"
import { GalleryComponent } from "./pages/gallery/gallery.component"
import { HomeComponent } from "./pages/home/home.component"
import { LoginComponent } from "./pages/login/login.component"
import { ProfileComponent } from "./pages/profile/profile.component"
import { RecipesComponent } from "./pages/recipes/recipes.component"
import { VariousComponent } from "./pages/various/various.component"

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
	],
	imports: [
		AppRoutingModule,
		BrowserModule,
		CryptModule,
		FormsModule,
		HttpClientModule,
	],
	providers: [AuthService],
	bootstrap: [AppComponent],
})
export class AppModule { }
