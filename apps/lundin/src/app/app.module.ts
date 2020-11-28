import { HttpClientModule } from "@angular/common/http"
import { NgModule } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { BrowserModule } from "@angular/platform-browser"
import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { AuthService } from "./auth/auth.service"
import { jwtInterceptorProvider } from "./auth/jwt-interceptor"
import { GamesComponent } from "./games/games.component"
import { HomeComponent } from "./home/home.component"
import { LoginComponent } from "./login/login.component"

@NgModule({
	declarations: [
		AppComponent,
		GamesComponent,
		HomeComponent,
		LoginComponent,
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
