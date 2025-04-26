import { Id } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { Meld } from "../../meld"
import { BlockType, Blocks } from "../../state/block"
import { ChargeDashAction, JumpAction, ReleaseDashAction } from "../../state/game-update"
import { DisplayState, InputMode, ViewDirection, ViewDirectionFromAngle } from "../state/display-state"
import { Camera } from "./camera"
import { Input } from "./input"
import { ActionHandler } from "./input-handler"
import { InputParser } from "./input-parser"

export class ActionInputHandler implements ActionHandler {
	private Player!: Id

	constructor(
		private Game: Meld,
		private State: DisplayState,
		private Inputs: InputParser,
	) { }

	Update(player: Id) {
		this.Player = player
		if (this.State.InputMode == InputMode.Chat)
			return null

		const angle = !this.Inputs.CurrentVector.isZero()
			? this.Inputs.CurrentVector.getAngle()
			: this.Game.Entities.Orientation.Get.Of(this.Player) ?? 0

		const nearestBlock = this.NearestBlockAt(angle)
		if (Blocks.TypeOf(nearestBlock) == BlockType.Full)
			return this.ParseJump()
		else
			return this.ParseDash(angle)
	}

	private ParseJump() {
		if (this.Inputs.HasJustBeenReleased(this.ActionInput()))
			return new JumpAction(this.Player)
		return null
	}

	private ParseDash(angle: number) {
		//if (HasJustBeenPressed(Input.Action))
		//	new ChargeDashAction(player, angle);
		if (this.Inputs.HasJustBeenReleased(this.ActionInput()))
			return new ReleaseDashAction(this.Player, angle)
		if (this.Inputs.BoolStateFor(this.ActionInput()))
			return new ChargeDashAction(this.Player, angle)
		return null
	}

	private NearestBlockAt(angle: number) {
		const position = this.Game.Entities.Position.Get.Of(this.Player) ?? Vector3.Zero
		switch (ViewDirectionFromAngle(angle)) {
			case ViewDirection.North: return this.Game.Terrain.Get(position.X + Camera.North.X, position.Y + Camera.North.Y, position.Z + Camera.North.Z)
			case ViewDirection.NorthEast: return this.Game.Terrain.Get(position.X + Camera.NorthEast.X, position.Y + Camera.NorthEast.Y, position.Z + Camera.NorthEast.Z)
			case ViewDirection.East: return this.Game.Terrain.Get(position.X + Camera.East.X, position.Y + Camera.East.Y, position.Z + Camera.East.Z)
			case ViewDirection.SouthEast: return this.Game.Terrain.Get(position.X + Camera.SouthEast.X, position.Y + Camera.SouthEast.Y, position.Z + Camera.SouthEast.Z)
			case ViewDirection.South: return this.Game.Terrain.Get(position.X + Camera.South.X, position.Y + Camera.South.Y, position.Z + Camera.South.Z)
			case ViewDirection.SouthWest: return this.Game.Terrain.Get(position.X + Camera.SouthWest.X, position.Y + Camera.SouthWest.Y, position.Z + Camera.SouthWest.Z)
			case ViewDirection.West: return this.Game.Terrain.Get(position.X + Camera.West.X, position.Y + Camera.West.Y, position.Z + Camera.West.Z)
			case ViewDirection.NorthWest:
			default: return this.Game.Terrain.Get(position.X + Camera.NorthWest.X, position.Y + Camera.NorthWest.Y, position.Z + Camera.NorthWest.Z)
		}
	}

	private ActionInput() {
		return this.State.InputMode == InputMode.Normal
			? Input.NormalModeAction
			: Input.Action
	}
}
