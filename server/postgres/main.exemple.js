import {Sequelize} from "sequelize";

const sequelize = new Sequelize ('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'postgres'
})

const connexion=async()=>{
    try {
        await sequelize.authenticate();
        console.log('La connexion à été établit avec succès.');
    } catch (error) {
        console.error('Impossible de se connecter à la base de données:', error);
    }
}

export {
    connexion
}