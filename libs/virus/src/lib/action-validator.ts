import { VirusAction } from "./virus-action"
import { VirusConfig } from "./virus-config"
import { VirusState } from "./virus-state"

export class ActionValidator {
	constructor(
		private readonly config: VirusConfig,
		private readonly state: VirusState,
	) { }

	validate(action: VirusAction): { isValid: boolean, problems: string[] } {
		throw new Error("Not implemented")
	}
}
