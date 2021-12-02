import { Component, Input } from "@angular/core"
import { Router } from "@angular/router"
import { Person } from "@lundin/api-interfaces"

@Component({
	selector: "lundin-ancestry-tree-node",
	templateUrl: "./ancestry-tree-node.component.html",
	styleUrls: ["./ancestry-tree-node.component.scss"],
})
export class AncestryTreeNodeComponent {
	@Input() person: Person

	constructor (
		private router: Router
	) { }

	bornText(){
		const born = this.person?.information.find(x => x.title === "__born")
		return born?.content || "Ukendt"
	}

	deadText(){
		const dead = this.person?.information.find(x => x.title === "__dead")
		return dead?.content || "-"
	}

	navigateToPerson() {
		this.router.navigateByUrl("/ancestry/person/" + this.person._id)
	}
}