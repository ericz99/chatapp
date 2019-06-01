const express = require('express');
const Router = express.Router();

const { validateBody, schemas } = require('../../helper/routeHelper');
const { testAPIRoute, registerAPIRoute } = require('../../controller/UserController');

/**
 * @description Test API Route
 * @access public
 */
Router.get('/test', testAPIRoute);

/**
 * @description Register API Route
 * @access public
 */
Router.post('/register', validateBody(schemas.registerSchema), registerAPIRoute);




module.exports = Router;