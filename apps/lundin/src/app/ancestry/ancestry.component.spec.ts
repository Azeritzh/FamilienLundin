import { ComponentFixture, TestBed } from "@angular/core/testing"
import { AncestryComponent } from "./ancestry.component"

describe("AncestryComponent", () => {
	let component: AncestryComponent
	let fixture: ComponentFixture<AncestryComponent>

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AncestryComponent]
		}).compileComponents()
	})

	beforeEach(() => {
		fixture = TestBed.createComponent(AncestryComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it("should create", () => {
		expect(component).toBeTruthy()
	})
})
