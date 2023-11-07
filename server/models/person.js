module.exports = (sequelize, DataType) => {
	const model = sequelize.define(
		'Person',
		{
			id: {
				type: DataType.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			last_name: {
				type: DataType.STRING,
			},
			first_name: {
				type: DataType.STRING,
			},
			cnp: {
				type: DataType.STRING(13),
			},
			varsta: {
				type: DataType.INTEGER,
				validate: { len: [1, 3] },
			},
		},
		{
			timestamps: true,
		}
	);
	setTimeout(() => {
		model.belongsToMany(sequelize.models.Car, {
			foreignKey: 'id_person',
			through: sequelize.models.Jonction,
		});
	}, 0);
	return model;
};
