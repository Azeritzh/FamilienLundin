import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { AgentiaComponent } from "./modules/agentia/agentia.component"
import { AncestryRootComponent } from "./modules/ancestry/ancestry-root/ancestry-root.component"
import { ancestryRoutes } from "./modules/ancestry/routes"
import { CalendarRootComponent } from "./modules/calendar/calendar-root/calendar-root.component"
import { calendarRoutes } from "./modules/calendar/routes"
import { CryptComponent } from "./modules/crypt/crypt.component"
import { GalleryRootComponent } from "./modules/gallery/gallery-root/gallery-root.component"
import { galleryRoutes } from "./modules/gallery/routes"
import { KingdomsComponent } from "./modules/kingdoms/kingdoms.component"
import { MediaComponent } from "./modules/media/media.component"
import { MusicComponent } from "./modules/media/music.component"
import { MeldComponent } from "./modules/meld/meld.component"
import { MessageRootComponent } from "./modules/message/message-root/message-root.component"
import { messageRoutes } from "./modules/message/routes"
import { MinestrygerComponent } from "./modules/minestryger/minestryger.component"
import { NoughtsAndCrossesComponent } from "./modules/noughts-and-crosses/noughts-and-crosses.component"
import { RecipesRootComponent } from "./modules/recipes/recipes-root/recipes-root.component"
import { recipesRoutes } from "./modules/recipes/routes"
import { RenderendComponent } from "./modules/renderend/renderend.component"
import { VirusComponent } from "./modules/virus/virus.component"
import { HomeComponent } from "./pages/home/home.component"
import { IframeGameComponent } from "./pages/iframe-game/iframe-game.component"
import { ProfileComponent } from "./pages/profile/profile.component"
import { VariousComponent } from "./pages/various/various.component"
import { IsAuthenticatedGuard } from "./services/is-authenticated.guard"

const routes: Routes = [
	{ path: "", component: HomeComponent },
	{ path: "ancestry", component: AncestryRootComponent, children: ancestryRoutes },
	{ path: "calendar", component: CalendarRootComponent, canActivate: [IsAuthenticatedGuard], children: calendarRoutes },
	{ path: "gallery", component: GalleryRootComponent, canActivate: [IsAuthenticatedGuard], children: galleryRoutes },
	{ path: "games/iframe/:game", component: IframeGameComponent },
	{ path: "games/kingdoms", component: KingdomsComponent },
	{ path: "games/meld", component: MeldComponent },
	{ path: "games/minestryger", component: MinestrygerComponent, canActivate: [IsAuthenticatedGuard] },
	{ path: "games/noughts-and-crosses", component: NoughtsAndCrossesComponent },
	{ path: "games/renderend", component: RenderendComponent },
	{ path: "games/virus", component: VirusComponent },
	{ path: "media", component: MediaComponent },
	{ path: "messages", component: MessageRootComponent, canActivate: [IsAuthenticatedGuard], children: messageRoutes },
	{ path: "music", component: MusicComponent },
	{ path: "profile", component: ProfileComponent, canActivate: [IsAuthenticatedGuard] },
	{ path: "recipes", component: RecipesRootComponent, canActivate: [IsAuthenticatedGuard], children: recipesRoutes },
	{ path: "various", component: VariousComponent },
	{ path: "various/agentia", component: AgentiaComponent },
	{ path: "various/crypt", component: CryptComponent, canActivate: [IsAuthenticatedGuard] },
]

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule { }
