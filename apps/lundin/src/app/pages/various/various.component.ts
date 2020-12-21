import { Component } from "@angular/core"

@Component({
	selector: "lundin-various",
	templateUrl: "./various.component.html",
	styleUrls: ["./various.component.scss"]
})
export class VariousComponent {
	games: { text: string, link: string }[] = [
		{ text: "Minestryger", link: "/games/iframe/minestryger" },
		{ text: "Tern", link: "/games/iframe/tern" },
		{ text: "Piong", link: "/games/iframe/piong" },
		{ text: "Game of Life", link: "/games/iframe/game-of-life" },
		{ text: "Bilspil", link: "/games/iframe/bilspil" },
		{ text: "Kryds og Bolle", link: "/games/noughts-and-crosses" },
		{ text: "Virus", link: "/games/virus" },
		{ text: "Krypt", link: "/various/crypt" },
	]
}
