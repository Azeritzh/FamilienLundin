import { GameLogic, Random, RegionCoordsFor, ValueGetter, ValueSetter } from "@lundin/age"
import { Vector3 } from "@lundin/utility"
import { GameConfig } from "../config/game-config"
import { GameState } from "../state/game-state"
import { GameUpdate } from "../state/game-update"
import { Globals } from "../state/globals"
import { MeldEntities } from "../state/meld-entities"
import { Region } from "../state/region"

export class SpawnMonsterLogic implements GameLogic<GameUpdate> {
	constructor(
		private Config: GameConfig,
		private State: GameState,
		private Globals: Globals,
		private Entities: MeldEntities,
		private Position: ValueGetter<Vector3>,
		private SetPosition: ValueSetter<Vector3>,
		private Random: Random,
	) { }

	Update() {
		if (this.Globals.Tick % 200 === 0)
			for (const region of this.ActiveRegions())
				this.SpawnMonsterIn(region)
	}

	private SpawnMonsterIn(region: Region) {
		const monsterType = this.Config.Lists.RandomlySpawningMonsters.first()
		const monster = this.Entities.Create(monsterType)
		const size = this.Config.Constants.RegionSize()
		const position = new Vector3(
			region.Offset.X + size.X * this.Random.Float(),
			region.Offset.Y + size.Y * this.Random.Float(),
			0)
		this.SetPosition.For(monster, position)
		this.Entities.DespawnTime.Set.For(monster, this.Globals.Tick + 10000)
	}

	private *ActiveRegions() {
		for (const player of this.State.Players.values()) {
			const position = this.Position.Of(player) ?? Vector3.Zero
			const regionCoords = RegionCoordsFor(Math.floor(position.X), Math.floor(position.Y), Math.floor(position.Z), this.Config.Constants.RegionSize())
			if (this.State.Regions.has(regionCoords.stringify()))
				yield this.State.Regions.get(regionCoords.stringify())
		}
	}
}
