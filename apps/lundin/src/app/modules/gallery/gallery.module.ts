import { HttpClientModule } from "@angular/common/http"
import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { MarkdownModule } from "ngx-markdown"
import { SharedModule } from "../../shared/shared.module"
import { GalleryComponent } from "./gallery/gallery.component"
import { AddImageComponent } from "./add-image/add-image.component"
import { EditImageComponent } from "./edit-image/edit-image.component"
import { GalleryService } from "./gallery.service"
import { GalleryRootComponent } from "./gallery-root/gallery-root.component"
import { AppRoutingModule } from "../../app-routing.module"

@NgModule({
	declarations: [
		AddImageComponent,
		EditImageComponent,
		GalleryComponent,
		GalleryRootComponent,
	],
	imports: [
		AppRoutingModule,
		BrowserModule,
		HttpClientModule,
		MarkdownModule.forRoot(),
		SharedModule,
	],
	providers: [GalleryService],
	exports: [
		GalleryRootComponent,
	],
})
export class GalleryModule { }
