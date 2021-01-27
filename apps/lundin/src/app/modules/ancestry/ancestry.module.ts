import { HttpClientModule } from "@angular/common/http"
import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { SharedModule } from "../../shared/shared.module"
import { AddFileComponent } from "./add-file/add-file.component"
import { AddPersonComponent } from "./add-person/add-person.component"
import { AncestryListComponent } from "./ancestry-list/ancestry-list.component"
import { AncestryTreeComponent } from "./ancestry-tree/ancestry-tree.component"
import { AncestryService } from "./ancestry.service"
import { EditInfoComponent } from "./edit-info/edit-info.component"
import { FamilyTreeComponent } from "./family-tree/family-tree.component"
import { PortraitComponent } from "./portrait/portrait.component"
import { PersonComponent } from "./person/person.component"

@NgModule({
	declarations: [
		AddFileComponent,
		AddPersonComponent,
		AncestryListComponent,
		EditInfoComponent,
		FamilyTreeComponent,
		PersonComponent,
		PortraitComponent,
		AncestryTreeComponent,
	],
	imports: [
		BrowserModule,
		SharedModule,
		HttpClientModule,
	],
	providers: [AncestryService],
	exports: [AncestryListComponent]
})
export class AncestryModule { }
