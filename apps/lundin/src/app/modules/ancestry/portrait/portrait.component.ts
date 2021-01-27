import { Component, Input } from "@angular/core"
import { Person } from "@lundin/api-interfaces"

@Component({
	selector: "lundin-portrait",
	templateUrl: "./portrait.component.html",
	styleUrls: ["./portrait.component.scss"],
})
export class PortraitComponent {
	@Input() person: Person
	@Input() relation: "partner" | "parent" | "child" | "sibling"

	relationText(){
		switch (this.relation) {
			case "partner": return "Partner"
			case "parent": return this.parentText()
			case "child": return this.childText()
			case "sibling": return this.siblingText()
		}
	}

	private parentText(){
		switch (this.person.gender) {
			case "male": return "Far"
			case "female": return "Mor"
			case "other": return "Forælder"
		}
	}

	private childText(){
		switch (this.person.gender) {
			case "male": return "Søn"
			case "female": return "Datter"
			case "other": return "Barn"
		}
	}

	private siblingText(){
		switch (this.person.gender) {
			case "male": return "Bror"
			case "female": return "Søster"
			case "other": return "Søskende"
		}
	}

	bornText(){
		const born = this.person.information.find(x => x.title === "__born")
		return born?.content || "Ukendt"
	}

	deadText(){
		const dead = this.person.information.find(x => x.title === "__dead")
		return dead?.content || "Levende"
	}
}
