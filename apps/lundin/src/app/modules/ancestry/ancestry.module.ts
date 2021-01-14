import { HttpClientModule } from "@angular/common/http"
import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { SharedModule } from "../../shared/shared.module"
import { AddPersonComponent } from "./add-person/add-person.component"
import { AncestryListComponent } from "./ancestry-list/ancestry-list.component"
import { AncestryService } from "./ancestry.service"
import { EditInfoComponent } from "./edit-info/edit-info.component"
import { PersonComponent } from "./person/person.component"
import { TreeComponent } from "./tree/tree.component"

@NgModule({
	declarations: [
		AddPersonComponent,
		AncestryListComponent,
		EditInfoComponent,
		PersonComponent,
		TreeComponent,
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
