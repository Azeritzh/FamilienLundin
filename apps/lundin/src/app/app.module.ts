import { HttpClientModule } from "@angular/common/http"
import { NgModule } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { BrowserModule } from "@angular/platform-browser"
import { AncestryComponent } from "./ancestry/ancestry.component"
import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { AuthService } from "./auth/auth.service"
import { jwtInterceptorProvider } from "./auth/jwt-interceptor"
import { CalendarComponent } from "./calendar/calendar.component"
import { GalleryComponent } from "./gallery/gallery.component"
import { GamesComponent } from "./games/games.component"
import { HomeComponent } from "./home/home.component"
import { LoginComponent } from "./login/login.component"
import { RecipesComponent } from "./recipes/recipes.component"

@NgModule({
	declarations: [
		AncestryComponent,
		AppComponent,
		CalendarComponent,
		GalleryComponent,
		GamesComponent,
		HomeComponent,
		LoginComponent,
		RecipesComponent,
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpClientModule,
		AppRoutingModule,
	],
	providers: [AuthService, jwtInterceptorProvider],
	bootstrap: [AppComponent],
})
export class AppModule { }
