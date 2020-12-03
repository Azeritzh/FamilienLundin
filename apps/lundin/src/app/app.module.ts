import { HttpClientModule } from "@angular/common/http"
import { NgModule } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { BrowserModule } from "@angular/platform-browser"
import { AncestryComponent } from "./pages/ancestry/ancestry.component"
import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./main-component/app.component"
import { AuthService } from "./auth/auth.service"
import { jwtInterceptorProvider } from "./auth/jwt-interceptor"
import { CalendarComponent } from "./pages/calendar/calendar.component"
import { GalleryComponent } from "./pages/gallery/gallery.component"
import { GamesComponent } from "./pages/games/games.component"
import { HomeComponent } from "./pages/home/home.component"
import { LoginComponent } from "./pages/login/login.component"
import { RecipesComponent } from "./pages/recipes/recipes.component"

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
