module.exports = (db) => {
	return {
		create: (req, res) => {
			db.models.Car.create(req.body)
				.then(() => {
					res.send({ success: true });
				})
				.catch((error) => {
					res.status(401);
				});
		},

		update: (req, res) => {
			db.models.Car.update(req.body, { where: { id: req.body.id } })
				.then(() => {
					res.send({ success: true });
				})
				.catch(() => res.status(401));
		},

		findAll: async (req, res) => {
			db.models.Car.findAll({
				include: [
					{
						model: db.models.Person,
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
			db.models.Car.findAll({
				where: {
					id: req.params.search,
				},
				include: [
					{
						model: db.models.Person,
						through: db.models.Jonction,
					},
				],
			})
				.then((resp) => {
					res.send(resp[0]);
				})
				.catch((error) => {
					res.status(401);
				});
		},

		destroy: async (req, res) => {
			try {
				await db.query(
					`DELETE FROM "Jonction" WHERE id_car = ${req.params.id}`,
					{
						type: db.QueryTypes.DELETE,
					}
				);
				await db.query(`DELETE FROM "Car" WHERE id = ${req.params.id}`);
				res.send({ success: true });
			} catch (error) {
				res.status(401);
			}
		},

		deletePerson: async (req, res) => {
			try {
				await db.query(
					`DELETE FROM Jonction WHERE id_person = ${req.params.id_person}`,
					{ type: db.QueryTypes.DELETE }
				);
				res.send({ success: true });
			} catch (error) {
				res.status(401);
			}
		},
	};
};
