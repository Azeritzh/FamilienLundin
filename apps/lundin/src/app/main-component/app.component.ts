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
		{ text: "Hjem", link: "/" },
		{ text: "Kalender", link: "/calendar" },
		{ text: "Familie", link: "/ancestry" },
		{ text: "Galleri", link: "/gallery" },
		{ text: "Opskrifter", link: "/recipes" },
		{ text: "Spil", link: "/games" },
	]
	@HostBinding("class.hidden-navigation") hideNavigation = false

	constructor(private authService: AuthService) { }

	isLoggedIn() {
		return !!this.authService.jwtToken
	}

	logout() {
		return this.authService.logout()
	}
}

interface NavigationEntry {
	text: string
	link: string
}
