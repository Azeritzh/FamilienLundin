import { Directive, HostBinding, Input } from "@angular/core"

@Directive({
	selector: "[labelling]",
	standalone: false,
})
export class LabellingDirective {
	@Input() labelling: any

	@HostBinding("class.raised-label") get shouldBeRaised() {
		return this.labelling.value || document.activeElement === this.labelling
	}

	@HostBinding("class.lowered-label") get shouldNotRaised() {
		return !this.shouldBeRaised
	}
}
