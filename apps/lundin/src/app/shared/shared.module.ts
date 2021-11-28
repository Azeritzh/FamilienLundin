import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { LabellingDirective } from "./directives/labelling.directive"
import { FileInputComponent } from "./file-input/file-input.component"
import { ImageInputComponent } from "./image-input/image-input.component"
import { UserPipe } from "./pipes/user.pipe"

@NgModule({
	declarations: [
		FileInputComponent,
		ImageInputComponent,
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
		ImageInputComponent,
		LabellingDirective,
		UserPipe,
	],
})
export class SharedModule { }
