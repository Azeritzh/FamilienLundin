import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { CryptComponent } from "./modules/crypt/crypt.component"
import { AncestryComponent } from "./pages/ancestry/ancestry.component"
import { CalendarComponent } from "./pages/calendar/calendar.component"
import { GalleryComponent } from "./pages/gallery/gallery.component"
import { HomeComponent } from "./pages/home/home.component"
import { RecipesComponent } from "./pages/recipes/recipes.component"
import { VariousComponent } from "./pages/various/various.component"

const routes: Routes = [
	{ path: "", component: HomeComponent },
	{ path: "ancestry", component: AncestryComponent },
	{ path: "calendar", component: CalendarComponent },
	{ path: "gallery", component: GalleryComponent },
	{ path: "recipes", component: RecipesComponent },
	{ path: "various", component: VariousComponent },
	{ path: "various/crypt", component: CryptComponent },
]

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule { }
