import { GameValidator, Validation } from "@lundin/age"
import { VirusAction } from "../virus-action"
import { VirusConfig } from "../virus-config"
import { VirusState } from "../virus-state"

export class ActionValidator implements GameValidator<VirusAction> {
	constructor(
		private readonly config: VirusConfig,
		private readonly state: VirusState,
	) { }

	validate(actions: VirusAction[]): Validation {
		throw new Error("Not implemented")
	}
}
