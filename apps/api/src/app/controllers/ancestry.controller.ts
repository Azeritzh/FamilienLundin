import type { Person, PersonalRelation } from "@lundin/api-interfaces"
import { Body, Controller, Get, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { JwtAuthGuard } from "../../auth/jwt.strategy"
import { StorageService } from "../../storage/storage.service"

@Controller("ancestry")
export class AncestryController {
	constructor(
		private readonly storageService: StorageService
	) { }

	@UseGuards(JwtAuthGuard)
	@Get("load-all")
	async loadAll() {
		return this.storageService.ancestryCollection.find()
	}

	@UseGuards(JwtAuthGuard)
	@Post("add")
	async save(@Body() person: Person) {
		const newPerson = this.storageService.ancestryCollection.insertOne(person)
		const updatedPeople = [newPerson]
		for (const relation of person.relations)
			updatedPeople.push(this.updateForRelation(newPerson._id, relation))
		return updatedPeople
	}

	private updateForRelation(personId: number, relation: PersonalRelation) {
		return this.storageService.ancestryCollection.updateOne(
			{ _id: relation.id },
			x => x.relations.push({ id: personId, type: this.oppositeTypeOf(relation) })
		)
	}

	private oppositeTypeOf(relation: PersonalRelation) {
		switch (relation.type) {
			case "child": return "parent"
			case "parent": return "child"
			case "partner": return "partner"
		}
	}

	@UseGuards(JwtAuthGuard)
	@Post("update-info")
	async updateInfo(@Body() message: { personId: number, name: string, gender: "male" | "female" | "other", information: { title: string, content: string }[] }) {
		return this.storageService.ancestryCollection.updateOne(
			{ _id: message.personId },
			x => {
				x.name = message.name
				x.gender = message.gender
				x.information = message.information
			}
		)
	}

	@UseGuards(JwtAuthGuard)
	@Post("update-relations")
	async updateRelations(@Body() message: { personId: number, relations: PersonalRelation[] }) {
		const oldRelations = this.storageService.ancestryCollection.findOne({ _id: message.personId }).relations

		const newPerson = this.storageService.ancestryCollection.updateOne(
			{ _id: message.personId },
			x => x.relations = message.relations
		)
		const updatedPeople = [newPerson]
		for (const relation of oldRelations)
			updatedPeople.push(this.updateForRemovedRelation(newPerson._id, relation))
		for (const relation of message.relations)
			updatedPeople.push(this.updateForRelation(newPerson._id, relation))
		return updatedPeople
	}

	private updateForRemovedRelation(personId: number, relation: PersonalRelation) {
		return this.storageService.ancestryCollection.updateOne(
			{ _id: relation.id },
			x => this.removeRelationBetween(x, personId)
		)
	}

	private removeRelationBetween(person: Person, otherPersonId: number) {
		const index = person.relations.findIndex(x => x.id === otherPersonId)
		person.relations.splice(index, 1)
	}

	@UseGuards(JwtAuthGuard)
	@Post("delete")
	async delete(@Body() message: { personId: number }) {
		this.storageService.ancestryCollection.deleteOne({ _id: message.personId })
		return this.storageService.ancestryCollection.updateMany(
			this.hasRelationTo(message.personId),
			this.deleteRelationsTo(message.personId))
	}

	private hasRelationTo = (personId: number) => (entry: Person) => {
		return entry.relations.some(x => x.id === personId)
	}

	private deleteRelationsTo = (personId: number) => (entry: Person) => {
		entry.relations = entry.relations.filter(x => x.id !== personId)
	}

	@UseGuards(JwtAuthGuard)
	@Post("upload-file")
	@UseInterceptors(FileInterceptor("file", { dest: "./ancestry-uploads" }))
	async uploadFile(@UploadedFile() file, @Body() message: { name: string, description: string, personId: string }) {
		return this.storageService.ancestryCollection.updateOne(
			{ _id: +message.personId },
			x => x.files.push({ name: message.name, description: message.description, fileId: file.filename })
		)
	}

	@UseGuards(JwtAuthGuard)
	@Get("file/:fileId/:fileName")
	async getFile(@Param("fileId") fileId, @Res() res) {
		res.sendFile(fileId, { root: "ancestry-uploads" })
	}
}
