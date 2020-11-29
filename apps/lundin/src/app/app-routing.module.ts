import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { AncestryComponent } from "./ancestry/ancestry.component"
import { CalendarComponent } from "./calendar/calendar.component"
import { GalleryComponent } from "./gallery/gallery.component"
import { GamesComponent } from "./games/games.component"
import { HomeComponent } from "./home/home.component"
import { RecipesComponent } from "./recipes/recipes.component"

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
