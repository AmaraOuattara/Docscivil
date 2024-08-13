const express = require('express');
const app = express();
const port = 3000;
const sequelize = require('./config/database');
const userRoutes = require('./routes/UsersRoutes');
const authRoutes = require ('./routes/authRoutes');
const deviceRoutes = require ('./routes/DeviceRoutes');
const communeRoutes = require('./routes/communeRoutes');
const localiteRoutes = require('./routes/localiteRoutes');
const juridictionRoutes = require('./routes/juridictionRoutes');
const zoneRoutes = require('./routes/zoneRoutes');
const etatRoutes = require('./routes/etatRoutes');
const typecopieRoutes = require('./routes/typecopieRoutes');
const prospectRoutes = require('./routes/prospectRoutes');
const listediffusionRoutes = require('./routes/listediffusionRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./SwaggerConfig');

// Middleware pour parser les corps de requêtes JSON
app.use(express.json());

// Routes
app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', deviceRoutes);
app.use('/api', communeRoutes);
app.use('/api', localiteRoutes);
app.use('/api', etatRoutes);
app.use('/api', juridictionRoutes);
app.use('/api', zoneRoutes);
app.use('/api', typecopieRoutes);
app.use('/api', prospectRoutes);
app.use('/api', listediffusionRoutes);

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Démarrer le serveur
app.listen(port, async () => {
  try {
    await sequelize.sync();
    console.log(`Serveur démarré sur http://localhost:${port}`);
  } catch (error) {
    console.error('Impossible de se connecter à la base de données :', error);
  }
});
