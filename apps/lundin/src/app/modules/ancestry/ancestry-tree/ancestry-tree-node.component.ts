import { Component, Input } from "@angular/core";
import { PersonNode } from "./ancestry-tree.component";

@Component({
	selector: "lundin-ancestry-tree-node",
	templateUrl: "./ancestry-tree-node.component.html",
	styleUrls: ["./ancestry-tree-node.component.scss"],
})
export class AncestryTreeNodeComponent {
	@Input() personNode: PersonNode
}