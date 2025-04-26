import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core"
import { SharedModule } from "../../shared/shared.module"
import { MeldComponent } from "./meld.component"

@NgModule({
	declarations: [
		MeldComponent,
	],
	imports: [
		CommonModule,
		SharedModule,
	],
	providers: [],
})
export class MeldModule { }
