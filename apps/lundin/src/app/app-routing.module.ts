import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { CryptComponent } from "./modules/crypt/crypt.component"
import { MessageThreadComponent } from "./modules/message/message-thread/message-thread.component"
import { NoughtsAndCrossesComponent } from "./modules/noughts-and-crosses/noughts-and-crosses.component"
import { AncestryComponent } from "./pages/ancestry/ancestry.component"
import { CalendarComponent } from "./pages/calendar/calendar.component"
import { GalleryComponent } from "./pages/gallery/gallery.component"
import { HomeComponent } from "./pages/home/home.component"
import { IframeGameComponent } from "./pages/iframe-game/iframe-game.component"
import { ProfileComponent } from "./pages/profile/profile.component"
import { RecipesComponent } from "./pages/recipes/recipes.component"
import { VariousComponent } from "./pages/various/various.component"

const routes: Routes = [
	{ path: "", component: HomeComponent },
	{ path: "ancestry", component: AncestryComponent },
	{ path: "calendar", component: CalendarComponent },
	{ path: "gallery", component: GalleryComponent },
	{ path: "games/iframe/:game", component: IframeGameComponent },
	{ path: "games/noughts-and-crosses", component: NoughtsAndCrossesComponent },
	{ path: "messages/:id", component: MessageThreadComponent },
	{ path: "profile", component: ProfileComponent },
	{ path: "recipes", component: RecipesComponent },
	{ path: "various", component: VariousComponent },
	{ path: "various/crypt", component: CryptComponent },
]

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule { }
