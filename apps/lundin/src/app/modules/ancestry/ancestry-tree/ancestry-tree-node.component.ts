import { Component, Input } from "@angular/core";
import { PersonNode } from "./ancestry-tree.component";

@Component({
	selector: "lundin-ancestry-tree-node",
	templateUrl: "./ancestry-tree-node.component.html",
	styleUrls: ["./ancestry-tree-node.component.scss"],
})
export class AncestryTreeNodeComponent {
	@Input() personNode: PersonNode

	bornText(){
		const born = this.personNode.person.information.find(x => x.title === "__born")
		return born?.content || "Ukendt"
	}

	deadText(){
		const dead = this.personNode.person.information.find(x => x.title === "__dead")
		return dead?.content || "-"
	}
}