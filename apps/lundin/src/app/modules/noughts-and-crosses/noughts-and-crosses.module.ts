import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core"
import { SharedModule } from "../../shared/shared.module"
import { NoughtsAndCrossesComponent } from "./noughts-and-crosses.component"

@NgModule({
	declarations: [NoughtsAndCrossesComponent],
	imports: [
		CommonModule,
		SharedModule,
	],
	providers: [],
})
export class NoughtsAndCrossesModule { }
