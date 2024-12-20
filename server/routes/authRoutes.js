const express = require('express');
const router = express.Router();

function initAuthRoutes(db) {
   const AuthController = require('../controllers/authController');
   const authController = new AuthController(db);

   router.post('/register', (req, res) => authController.register(req, res));
   router.post('/login', (req, res) => authController.login(req, res));

   return router;
}

module.exports = initAuthRoutes;