import { HttpClientModule } from "@angular/common/http"
import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { AppRoutingModule } from "../../app-routing.module"
import { SharedModule } from "../../shared/shared.module"
import { AddFileComponent } from "./add-file/add-file.component"
import { AddPersonComponent } from "./add-person/add-person.component"
import { AncestryListComponent } from "./ancestry-list/ancestry-list.component"
import { AncestryTreeNodeComponent } from "./ancestry-tree/ancestry-tree-node.component"
import { AncestryTreeComponent } from "./ancestry-tree/ancestry-tree.component"
import { AncestryService } from "./ancestry.service"
import { EditFileComponent } from "./edit-file/edit-file.component"
import { EditInfoComponent } from "./edit-info/edit-info.component"
import { EditRelationsComponent } from "./edit-relations/edit-relations.component"
import { FamilyTreeComponent } from "./family-tree/family-tree.component"
import { PersonComponent } from "./person/person.component"
import { PortraitComponent } from "./portrait/portrait.component"

@NgModule({
	declarations: [
		AddFileComponent,
		AddPersonComponent,
		AncestryListComponent,
		EditFileComponent,
		EditInfoComponent,
		EditRelationsComponent,
		FamilyTreeComponent,
		PersonComponent,
		AncestryTreeNodeComponent,
		AncestryTreeComponent,
		PortraitComponent,
	],
	imports: [
		AppRoutingModule,
		BrowserModule,
		SharedModule,
		HttpClientModule,
	],
	providers: [AncestryService],
	exports: [AncestryListComponent]
})
export class AncestryModule { }
