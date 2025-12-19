import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "Size",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      tableName: "sizes",
      timestamps: false,
    }
  );


