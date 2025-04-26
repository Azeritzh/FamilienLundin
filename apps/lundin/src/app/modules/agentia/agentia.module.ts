import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core"
import { SharedModule } from "../../shared/shared.module"
import { AgentiaComponent } from "./agentia.component"

@NgModule({
	declarations: [AgentiaComponent],
	imports: [
		CommonModule,
		SharedModule,
	],
	providers: [],
})
export class AgentiaModule { }
