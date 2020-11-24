import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { GamesComponent } from "./games/games.component"
import { HomeComponent } from "./home/home.component"

const routes: Routes = [
	{ path: "", component: HomeComponent },
	{ path: "games", component: GamesComponent },
]

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
