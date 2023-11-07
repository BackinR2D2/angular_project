module.exports = (sequelize, DataType) => {
	const model = sequelize.define('Jonction', {
		id_person: {
			type: DataType.INTEGER,
			references: {
				model: sequelize.models.Person,
				key: 'id',
			},
		},
		id_car: {
			type: DataType.INTEGER,
			references: {
				model: sequelize.models.Car,
				key: 'id',
			},
		},
	});
	return model;
};
