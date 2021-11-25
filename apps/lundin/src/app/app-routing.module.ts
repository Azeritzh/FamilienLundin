import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { AgentiaComponent } from "./modules/agentia/agentia.component"
import { AncestryRootComponent } from "./modules/ancestry/ancestry-root/ancestry-root.component"
import { ancestryRoutes } from "./modules/ancestry/routes"
import { CryptComponent } from "./modules/crypt/crypt.component"
import { GalleryComponent } from "./modules/gallery/gallery/gallery.component"
import { KingdomsComponent } from "./modules/kingdoms/kingdoms.component"
import { MessageThreadComponent } from "./modules/message/message-thread/message-thread.component"
import { MinestrygerComponent } from "./modules/minestryger/minestryger.component"
import { NoughtsAndCrossesComponent } from "./modules/noughts-and-crosses/noughts-and-crosses.component"
import { RecipesComponent } from "./modules/recipes/recipes/recipes.component"
import { VirusComponent } from "./modules/virus/virus.component"
import { CalendarComponent } from "./pages/calendar/calendar.component"
import { HomeComponent } from "./pages/home/home.component"
import { IframeGameComponent } from "./pages/iframe-game/iframe-game.component"
import { ProfileComponent } from "./pages/profile/profile.component"
import { VariousComponent } from "./pages/various/various.component"
import { IsAuthenticatedGuard } from "./services/is-authenticated.guard"

const routes: Routes = [
	{ path: "", component: HomeComponent },
	{ path: "ancestry", component: AncestryRootComponent, children: ancestryRoutes },
	{ path: "calendar", component: CalendarComponent, canActivate: [IsAuthenticatedGuard] },
	{ path: "gallery", component: GalleryComponent, canActivate: [IsAuthenticatedGuard] },
	{ path: "games/iframe/:game", component: IframeGameComponent },
	{ path: "games/kingdoms", component: KingdomsComponent },
	{ path: "games/minestryger", component: MinestrygerComponent, canActivate: [IsAuthenticatedGuard] },
	{ path: "games/noughts-and-crosses", component: NoughtsAndCrossesComponent },
	{ path: "games/virus", component: VirusComponent },
	{ path: "messages/:id", component: MessageThreadComponent, canActivate: [IsAuthenticatedGuard] },
	{ path: "profile", component: ProfileComponent, canActivate: [IsAuthenticatedGuard] },
	{ path: "recipes", component: RecipesComponent, canActivate: [IsAuthenticatedGuard] },
	{ path: "various", component: VariousComponent },
	{ path: "various/agentia", component: AgentiaComponent },
	{ path: "various/crypt", component: CryptComponent, canActivate: [IsAuthenticatedGuard] },
]

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule { }
