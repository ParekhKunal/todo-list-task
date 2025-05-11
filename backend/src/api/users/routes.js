'use strict';

const express = require('express');
const userController = require('./controllers/user-controller.js');
const { authenticate } = require('../../common/middlewares/authenticate.js');
const { validate } = require('../../common/middlewares/validate.js');
const { userValidation } = require('./validators/user-validator.js');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and login
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - fullName
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               phoneNumber:
 *                 type: string
 *                 example: "+1234567890"
 *               bio:
 *                 type: string
 *                 example: "Software developer with 5 years of experience"
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: User already exists
 */
router.post('/signup', userController.createUser);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: kunalparekhh@gmail.com
 *               password:
 *                 type: string
 *                 example: 12345678
 *     responses:
 *       200:
 *         description: Successful login
 *       404:
 *          description: Not Found
 */
router.post('/login', validate(userValidation.login), userController.login);

router.get('/profile', authenticate, userController.getProfile);
router.put(
  '/profile',
  authenticate,
  validate(userValidation.updateProfile),
  userController.updateProfile
);

router.get('/', authenticate, userController.getAllUsers);


router.get('/:id', authenticate, userController.getUserById);

module.exports = router;
