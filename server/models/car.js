module.exports = (sequelize, DataType) => {
	const model = sequelize.define(
		'Car',
		{
			id: {
				type: DataType.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			marca: {
				type: DataType.STRING,
			},
			model: {
				type: DataType.STRING,
			},
			an_fabricatie: {
				type: DataType.INTEGER,
				validate: { len: [1, 4] },
			},
			capacitate_cilindrica: {
				type: DataType.INTEGER,
				validate: { len: [1, 4] },
			},
			taxa_impozit: {
				type: DataType.INTEGER,
				validate: { len: [1, 4] },
			},
		},
		{
			timestamps: true,
		}
	);
	setTimeout(() => {
		model.belongsToMany(sequelize.models.Person, {
			foreignKey: 'id_car',
			through: sequelize.models.Jonction,
		});
	}, 0);
	return model;
};
