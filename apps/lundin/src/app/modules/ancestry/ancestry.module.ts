import { HttpClientModule } from "@angular/common/http"
import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { SharedModule } from "../../shared/shared.module"
import { AddPersonComponent } from "./add-person/add-person.component"
import { AncestryListComponent } from "./ancestry-list/ancestry-list.component"
import { AncestryService } from "./ancestry.service"
import { PersonComponent } from "./person/person.component"

@NgModule({
	declarations: [
		AddPersonComponent,
		AncestryListComponent,
		PersonComponent,
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
