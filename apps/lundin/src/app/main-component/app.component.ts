import { Component, HostBinding } from "@angular/core"
import { AuthService } from "../auth/auth.service"

@Component({
	selector: "lundin-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent {
	header = "Familien Lundin"
	navigationEntries: NavigationEntry[] = [
		{ text: "Hjem", link: "/", imageUrl: "/assets/images/icons/Home_icon.svg" },
		{ text: "Kalender", link: "/calendar", imageUrl: "/assets/images/icons/Calendar_icon.svg" },
		{ text: "Familie", link: "/ancestry", imageUrl: "/assets/images/icons/Family_icon.svg" },
		{ text: "Galleri", link: "/gallery", imageUrl: "/assets/images/icons/Gallery_icon.svg" },
		{ text: "Opskrifter", link: "/recipes", imageUrl: "/assets/images/icons/Recipes_icon.svg" },
		{ text: "Diverse", link: "/various", imageUrl: "/assets/images/icons/Home_icon.svg" },
	]
	@HostBinding("class.hidden-navigation") hideNavigation = false

	constructor(public authService: AuthService) { }
}

interface NavigationEntry {
	text: string
	link: string
	imageUrl: string
}
