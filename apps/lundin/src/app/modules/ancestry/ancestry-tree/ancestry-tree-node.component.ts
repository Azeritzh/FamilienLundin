import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { PersonNode } from "./ancestry-tree.component";

@Component({
	selector: "lundin-ancestry-tree-node",
	templateUrl: "./ancestry-tree-node.component.html",
	styleUrls: ["./ancestry-tree-node.component.scss"],
})
export class AncestryTreeNodeComponent {
	@Input() personNode: PersonNode

	constructor (
		private router: Router
	) { }

	bornText(){
		const born = this.personNode.person.information.find(x => x.title === "__born")
		return born?.content || "Ukendt"
	}

	deadText(){
		const dead = this.personNode.person.information.find(x => x.title === "__dead")
		return dead?.content || "-"
	}

	navigateToPerson() {
		this.router.navigateByUrl("/ancestry/person/" + this.personNode.person._id)
	}
}