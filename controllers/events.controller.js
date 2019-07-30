const fs = require('fs');
const fsPromise = require('fs').promises;
// const formidable = require('formidable');
const ObjectId = require('mongodb').ObjectId;

const Controller = require('../core/controller');
const Response = require('../core/response');
const Utils = require('../core/utils');


const ControllerConfig = {
    dir: `${__dirname}/../../events`,
    collection: 'events',
    keys: ['_id', 'name', 'type', 'extension', 'createDate']
};

//traemos al core/controller
class EventController extends Controller {
    constructor(config = ControllerConfig) {
        super(config);

        this.dir = config.dir;
        // this.formidable = new formidable.IncomingForm();
    }

    // esto se llama con el router.excute desde el objeto del index.js
    getAll (req, res, route) {
        this._find({}, route.query)
            // envia el evento a la clase Response
            .then(element => Response.Send(res, element))
            // no encuentra nada entonces manda un error con la clase Response
            .catch(err => Response.ApplicationError(res, err));
    }

    async createOne (req, res, route) {
        let event = Utils.sanitize(route.data, ['name', 'description']);

        let error = await this.validEvent(event);
        if(error) return Response.BadRequest(res, error);

        this.insertOne(event)
            .then(newEvent => Response.Send(res, newEvent))
            .catch(error => Response.ApplicationError(res, error));
    }

    async validEvent(event) {
        if(Utils.isEmpty(event)) return new Error(`Invalid event`);
        if(!event.name) return new Error(`Invalid event name`);

        // validates the name is unique
        let found = await this._findOne({name: event.name});
        if(found) return new Error(`event name already exist`);
        return null;
    }

    getOne (req, res, route) {
        let id = route.params.id;
        this._findOne(id)
            .then(event => Response.Send(res, event))
            .catch(error => Response.ApplicationError(res, error));
        // let query = route.query;

        // if(!Utils.isId(id))
        //     return Response.BadRequest(res, new Error(`Invalid ID`));

        // this._findOne(id)
        //     .then(({path, name, type, extension}) => {
        //         let headers = {
        //             'Content-disposition': `attachment; filename=${name}.${extension}`,
        //             'Content-Type': type
        //         };
        //         if(query && query.display === 'true' || query.display === '1')
        //             delete headers['Content-disposition'];
        //         Response.Send(res, fs.createReadStream(path), headers);
        //     })
        //     .catch(err => Response.ApplicationError(res, err));
    }

    removeOne (req, res, route) {
        let id = route.params.id;
        if(!Utils.isId(id)) return Response.ApplicationError(res, new Error(`Invalid ID`));

        this._remove(id)
            .then(() => Response.send(res, {id}))
            .catch(err => Response.ApplicationError(res, err))
    }

    putOne (req, res, route) {
        let id = route.params.id || null;

        if(!Utils.isId(id))
            Response.BadRequest(res, new Error(`Invalid id`));

        let event = Utils.sanitize(route.data, ['name', 'color', 'year', 'description']) || {};
        if(Utils.isEmpty(event))
            return Response.BadRequest(new Error(`Invalid event`));

        this._update(id, event)
            .then(updatedEvent => Response.Send(res, updatedEvent))
            .catch(error => Response.ApplicationError(res, error));
    }
}

module.exports = new EventController();