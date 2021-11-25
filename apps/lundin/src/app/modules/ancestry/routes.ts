import { Routes } from "@angular/router"
import { AncestryListComponent } from "./ancestry-list/ancestry-list.component"
import { AncestryTreeComponent } from "./ancestry-tree/ancestry-tree.component"
import { PersonComponent } from "./person/person.component"

export const ancestryRoutes: Routes = [
	{ path: "", component: AncestryListComponent },
	{ path: "person/:id", component: PersonComponent },
	{ path: "tree/:id", component: AncestryTreeComponent },
]
