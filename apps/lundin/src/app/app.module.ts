import { HttpClientModule } from "@angular/common/http"
import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { AppComponent } from "./app.component";
import { AppRoutingModule } from './app-routing.module';
import { GamesComponent } from './games/games.component'

@NgModule({
  declarations: [AppComponent, GamesComponent],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
