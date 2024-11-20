const express = require('express');
const cors = require('cors');
const { Item } = require('./models');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const passport = require("passport");
const { sequelize } = require('./config/database'); // Load database.js
const imageRoutes = require('./routes/images');


const app = express();

//Start of middlewares
app.use(express.json()); //Handle JSON's correctly
app.use(cors()); // Enable CORS
app.use(passport.initialize()); //Enable Passport middleware

//End of Middlewares

//Passport config loaded
require('./config/passport');

//Protected routes and router
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);

// Swagger setup
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for the backend',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./index.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Retrieve a list of items
 *     responses:
 *       200:
 *         description: A list of items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 */
app.get('/items', async (req, res) => {
  const items = await Item.findAll();
  res.json(items);
});

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Create a new item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: The created item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 */
app.post('/items', async (req, res) => {
  const item = await Item.create(req.body);
  res.json(item);
});

/**
 * @swagger
 * /items/{id}:
 *   put:
 *     summary: Update an item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 */
app.put('/items/:id', async (req, res) => {
  const item = await Item.findByPk(req.params.id);
  item.update(req.body);
  res.json(item);
});

/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     summary: Delete an item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.delete('/items/:id', async (req, res) => {
  const item = await Item.findByPk(req.params.id);
  item.destroy();
  res.json({ message: 'Item deleted' });
});

app.use('/api/images', imageRoutes)

app.listen(3000, async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');

    // Synchronize models
    await sequelize.sync({ force: false }); // Set force to true to drop and recreate tables
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  console.log('Server is running on port 3000');
});