import { Component } from "@angular/core"
import { AuthService } from "../../services/auth.service"

@Component({
	selector: "lundin-various",
	templateUrl: "./various.component.html",
	styleUrls: ["./various.component.scss"],
	standalone: false,
})
export class VariousComponent {
	tools: Entry[] = [
		{ title: "Krypt", link: "/various/crypt", mustBeLoggedIn: true },
		{ title: "Agentia", link: "/various/agentia" },
		{ title: "Game of Life", link: "/games/iframe/game-of-life" },
	]

	games: Entry[] = [
		{ title: "Minestryger", link: "/games/minestryger", mustBeLoggedIn: true },
		{ title: "Renderend", link: "/games/renderend" },
		{ title: "Virus", link: "/games/virus" },
		{ title: "Piong", link: "/games/iframe/piong" },
		{ title: "Tern", link: "/games/iframe/tern" },
	]

	wips: Entry[] = [
		{ title: "Unavngivet spil", link: "/games/kingdoms" },
		{ title: "Kryds og Bolle", link: "/games/noughts-and-crosses" },
		{ title: "Bilspil", link: "/games/iframe/bilspil" },
	]

	constructor(public authService: AuthService) { }

	shown(entries: Entry[]) {
		const isLoggedIn = this.authService.isLoggedIn()
		return entries.filter(x => x.mustBeLoggedIn ? isLoggedIn : true)
	}
}

interface Entry {
	title: string
	link: string
	mustBeLoggedIn?: boolean
}
