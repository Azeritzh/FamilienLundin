import { Component } from "@angular/core"

@Component({
	selector: "lundin-various",
	templateUrl: "./various.component.html",
	styleUrls: ["./various.component.scss"]
})
export class VariousComponent {
	tools: { title: string, link: string }[] = [
		{ title: "Krypt", link: "/various/crypt" },
	]

	games: { title: string, link: string }[] = [
		{ title: "Minestryger", link: "/games/minestryger" },
		{ title: "Virus", link: "/games/virus" },
		{ title: "Kryds og Bolle", link: "/games/noughts-and-crosses" },
		{ title: "Piong", link: "/games/iframe/piong" },
		{ title: "Game of Life", link: "/games/iframe/game-of-life" },
		{ title: "Bilspil", link: "/games/iframe/bilspil" },
	]
}
