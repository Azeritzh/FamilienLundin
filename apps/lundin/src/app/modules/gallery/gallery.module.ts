import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core"
import { RouterModule } from "@angular/router"
import { MarkdownModule } from "ngx-markdown"
import { SharedModule } from "../../shared/shared.module"
import { AddImageComponent } from "./add-image/add-image.component"
import { EditImageComponent } from "./edit-image/edit-image.component"
import { GalleryRootComponent } from "./gallery-root/gallery-root.component"
import { GalleryService } from "./gallery.service"
import { GalleryComponent } from "./gallery/gallery.component"

@NgModule({
	declarations: [
		AddImageComponent,
		EditImageComponent,
		GalleryComponent,
		GalleryRootComponent,
	],
	imports: [
		CommonModule,
		MarkdownModule.forRoot(),
		SharedModule,
		RouterModule,
	],
	providers: [GalleryService],
	exports: [
		GalleryRootComponent,
	],
})
export class GalleryModule { }
