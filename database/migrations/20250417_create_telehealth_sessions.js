module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('telehealth_sessions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      appointmentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'appointments', // Assuming there's an appointments table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      sessionUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      vitalSigns: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      sessionDuration: {
        type: Sequelize.INTEGER, // Duration in minutes
        allowNull: true,
      },
      sessionStatus: {
        type: Sequelize.ENUM('scheduled', 'completed', 'canceled', 'no-show'),
        allowNull: false,
        defaultValue: 'scheduled',
      },
      patientFeedback: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('telehealth_sessions');
  },
};
