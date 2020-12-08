import { Directive, ViewContainerRef } from "@angular/core"

@Directive({
	selector: "[lundinOverlayHost]",
})
export class OverlayHostDirective {
	constructor(public viewContainerRef: ViewContainerRef) { }
}
