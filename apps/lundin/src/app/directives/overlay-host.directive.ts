import { Directive, ViewContainerRef } from "@angular/core"

@Directive({
	selector: "[lundinOverlayHost]",
	standalone: false,
})
export class OverlayHostDirective {
	constructor(public viewContainerRef: ViewContainerRef) { }
}
