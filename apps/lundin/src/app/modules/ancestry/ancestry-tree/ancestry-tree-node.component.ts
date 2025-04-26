import { Component, HostListener, Input } from "@angular/core"
import { Router } from "@angular/router"
import { Person } from "@lundin/api-interfaces"

@Component({
	selector: "lundin-ancestry-tree-node",
	templateUrl: "./ancestry-tree-node.component.html",
	styleUrls: ["./ancestry-tree-node.component.scss"],
})
export class AncestryTreeNodeComponent {
	@Input() person!: Person

	@HostListener("click")
	navigateToPerson() {
		this.router.navigateByUrl("/ancestry/tree/" + this.person._id)
	}

	constructor(
		private router: Router
	) { }

	bornText() {
		const born = this.person?.information.find(x => x.title === "__born")
		return born?.content || "-"
	}

	deadText() {
		const dead = this.person?.information.find(x => x.title === "__dead")
		return dead?.content || "-"
	}
}