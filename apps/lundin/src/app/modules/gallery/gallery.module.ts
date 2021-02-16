import { HttpClientModule } from "@angular/common/http"
import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { MarkdownModule } from "ngx-markdown"
import { SharedModule } from "../../shared/shared.module"
import { GalleryComponent } from "./gallery/gallery.component"
import { AddImageComponent } from "./add-image/add-image.component"
import { EditImageComponent } from "./edit-image/edit-image.component"
import { GalleryService } from "./gallery.service"

@NgModule({
	declarations: [
		GalleryComponent,
		AddImageComponent,
		EditImageComponent
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		MarkdownModule.forRoot(),
		SharedModule,
	],
	providers: [GalleryService],
	exports: [
		GalleryComponent,
	],
})
export class GalleryModule { }
