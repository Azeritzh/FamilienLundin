import { Input } from "../services/input"

export interface DisplaySettings {
	Inputs: Map<Input, string[]>
}

export function DisplaySettingsFrom(deserialised: SerialisableDisplaySettings): DisplaySettings {
	const inputs = new Map<Input, string[]>()
	for (const key in deserialised.Inputs)
		inputs.set(Input[key as keyof typeof Input], deserialised.Inputs[key])

	return {
		Inputs: inputs,
	}
}

export interface SerialisableDisplaySettings {
	Inputs: { [input: string]: string[] },
}
