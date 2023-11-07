module.exports = (db) => {
	return {
		create: async (req, res) => {
			const { cars } = req.body;
			db.models.Person.create(req.body)
				.then(async (resp) => {
					for (const car of cars) {
						await db.models.Jonction.create({
							id_person: resp.id,
							id_car: car,
						});
					}
					res.send({ success: true });
				})
				.catch((err) => {
					res.status(401);
				});
		},

		update: (req, res) => {
			db.models.Person.update(req.body, { where: { id: req.body.id } })
				.then(() => {
					res.send({ success: true });
				})
				.catch(() => res.status(401));
		},

		findAll: async (req, res) => {
			db.models.Person.findAll({
				include: [
					{
						model: db.models.Car,
						through: db.models.Jonction,
					},
				],
			})
				.then((resp) => {
					res.send(resp);
				})
				.catch((err) => {
					console.error(err);
					res.status(401);
				});
		},

		find: (req, res) => {
			db.models.Person.findAll({
				where: {
					id: req.params.search,
				},
				include: [
					{
						model: db.models.Car,
						through: db.models.Jonction,
					},
				],
			})
				.then((resp) => {
					res.send(resp[0]);
				})
				.catch(() => res.status(401));
		},

		destroy: async (req, res) => {
			try {
				await db.query(
					`DELETE FROM "Jonction" WHERE id_person = ${req.params.id}`,
					{ type: db.QueryTypes.DELETE }
				);
				await db.query(`DELETE FROM "Person" WHERE id = ${req.params.id}`);
				res.send({ success: true });
			} catch (error) {
				res.status(401);
			}
		},
	};
};
