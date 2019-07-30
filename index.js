const http = require('http');

// const Mongoservice = require('./core/mongo');

const Response = require('./core/response');
const {Router} = require('./core/router');

const EventController = require('./controllers/events.controller');

const router = new Router([
    {
        path: '/api/v1/events',
        method: 'GET',
        callback: EventController.getAll.bind(EventController)
    },
    {
        path: '/api/v1/events',
        method: 'POST',
        callback: EventController.createOne.bind(EventController),
    },
    {
        path: 'api/v1/events/:id',
        method: 'GET',
        callback: EventController.getOne.bind(EventController),
    },
    {
        path: 'api/v1/events/:id',
        method: 'DELETE',
        callback: EventController.removeOne.bind(EventController),
    },
]);

const server = http.createServer((req, res) => {
    let route = router.find(req.url, req.method);
    // si hay una ruta ejecuta la accion que esta en el objeto router
    if(route) return route.execute(req, res);
    Response.BadRequest(res, new Error('Route not found'));
});

server.listen(5000);
