module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('blockchain_records', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      patientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'patients', // Assuming you have a patients table
          key: 'id',
        },
        onUpdate: 'CASCADE', // Update patientId if the referenced patient is updated
        onDelete: 'CASCADE', // Delete records if the referenced patient is deleted
      },
      transactionHash: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // Ensure each transaction hash is unique
      },
      recordData: {
        type: Sequelize.JSONB, // Store the actual medical record data as JSON
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'), // Default to current timestamp
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'), // Default to current timestamp
      },
    });

    // Create indexes for better performance
    await queryInterface.addIndex('blockchain_records', ['patientId']);
    await queryInterface.addIndex('blockchain_records', ['transactionHash']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('blockchain_records');
  },
};
