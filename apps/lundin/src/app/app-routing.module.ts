import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { AncestryTreeComponent } from "./modules/ancestry/ancestry-tree/ancestry-tree.component"
import { PersonComponent } from "./modules/ancestry/person/person.component"
import { CryptComponent } from "./modules/crypt/crypt.component"
import { MessageThreadComponent } from "./modules/message/message-thread/message-thread.component"
import { MinestrygerComponent } from "./modules/minestryger/minestryger.component"
import { NoughtsAndCrossesComponent } from "./modules/noughts-and-crosses/noughts-and-crosses.component"
import { VirusComponent } from "./modules/virus/virus.component"
import { AncestryComponent } from "./pages/ancestry/ancestry.component"
import { CalendarComponent } from "./pages/calendar/calendar.component"
import { GalleryComponent } from "./pages/gallery/gallery.component"
import { HomeComponent } from "./pages/home/home.component"
import { IframeGameComponent } from "./pages/iframe-game/iframe-game.component"
import { ProfileComponent } from "./pages/profile/profile.component"
import { RecipesComponent } from "./pages/recipes/recipes.component"
import { VariousComponent } from "./pages/various/various.component"
import { IsAuthenticatedGuard } from "./services/is-authenticated.guard"

const routes: Routes = [
	{ path: "", component: HomeComponent },
	{ path: "ancestry", component: AncestryComponent },
	{ path: "ancestry/person/:id", component: PersonComponent },
	{ path: "ancestry/tree/:id", component: AncestryTreeComponent },
	{ path: "calendar", component: CalendarComponent, canActivate: [IsAuthenticatedGuard] },
	{ path: "gallery", component: GalleryComponent, canActivate: [IsAuthenticatedGuard] },
	{ path: "games/iframe/:game", component: IframeGameComponent },
	{ path: "games/minestryger", component: MinestrygerComponent, canActivate: [IsAuthenticatedGuard] },
	{ path: "games/noughts-and-crosses", component: NoughtsAndCrossesComponent },
	{ path: "games/virus", component: VirusComponent },
	{ path: "messages/:id", component: MessageThreadComponent, canActivate: [IsAuthenticatedGuard] },
	{ path: "profile", component: ProfileComponent, canActivate: [IsAuthenticatedGuard] },
	{ path: "recipes", component: RecipesComponent, canActivate: [IsAuthenticatedGuard] },
	{ path: "various", component: VariousComponent },
	{ path: "various/crypt", component: CryptComponent, canActivate: [IsAuthenticatedGuard] },
]

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule { }
