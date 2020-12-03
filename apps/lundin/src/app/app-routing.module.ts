import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { AncestryComponent } from "./pages/ancestry/ancestry.component"
import { CalendarComponent } from "./pages/calendar/calendar.component"
import { GalleryComponent } from "./pages/gallery/gallery.component"
import { GamesComponent } from "./pages/games/games.component"
import { HomeComponent } from "./pages/home/home.component"
import { RecipesComponent } from "./pages/recipes/recipes.component"

const routes: Routes = [
	{ path: "", component: HomeComponent },
	{ path: "ancestry", component: AncestryComponent },
	{ path: "calendar", component: CalendarComponent },
	{ path: "gallery", component: GalleryComponent },
	{ path: "games", component: GamesComponent },
	{ path: "recipes", component: RecipesComponent },
]

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule { }
