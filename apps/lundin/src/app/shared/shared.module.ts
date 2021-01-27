import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { LabellingDirective } from "./directives/labelling.directive"
import { FileInputComponent } from "./file-input/file-input.component"
import { UserPipe } from "./pipes/user.pipe"

@NgModule({
	declarations: [
		FileInputComponent,
		LabellingDirective,
		UserPipe,
	],
	imports: [
		CommonModule,
		FormsModule,
	],
	exports: [
		FileInputComponent,
		FormsModule,
		LabellingDirective,
		UserPipe,
	],
})
export class SharedModule { }
