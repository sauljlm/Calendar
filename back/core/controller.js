// const fs = require('fs').promises;
const Mongo = require('./mongo');
const Utils = require('./utils');

//configuracion default
const CONFIG = {
    collection: '',
    keys: []
};

/**
 * for the CRUD operations
 * para configurar un controler del mongo
 */
class Controller {
    constructor(config = CONFIG) {
        this.db = new Mongo();

        this.keys = config.keys;
        this.collectionName = config.collection;
        this._collection = null;
    }

    get collection () {
        if(this._collection) return Promise.resolve(this._collection);
        return this.db.getCollection(this.collectionName)
            .then(collection => this._collection = collection);
    }

    async _find (query = {}, options = {}) {
        options = this._getOptions(options);
        let col = await this.collection;
        //.find es un methodo de mongo
        let cursor = col.find(query);
        // if(options.project) cursor.project(options.project)
        // if(options.skip) cursor.skip(options.skip);
        // if(options.limit) cursor.limit(options.limit);
        // if(options.filter) cursor.filter(options.filter);
        // if(options.sort) cursor.sort(options.sort);

        return cursor.toArray();
    }

    async _findOne (query) {
        if(Utils.isEmpty(query)) return Promise.reject(new Error(`Empty query or id`));
        if(Utils.isId(query)) query = {_id: query};

        let col = await this.collection;
        return col.findOne(query);
    }

    async _insertOne (data) {
        if(Utils.isEmpty(data)) throw new Error(`Empty data`);

        return this.collection.insertOne(data)
            .then(results => results.ops.length ===1 ? results.ops[0] : results.ops);
    }

    // query = id
    // update = lo que se va a modificar
    async _update (query, update, options = null) {
        if(Utils.isEmpty(query)) throw new Error(`Empty query`);
        if(Utils.isEmpty(update)) throw new Error(`Empty update`);

        let col = await this.collection;
        return col.update(query, update, options);
    }

    async _remove (query) {
        if(Utils.isEmpty(query)) throw new Error(`Empty query`);

        let col = await this.collection;
        return col.remove(data);
    }

    // paginacion(query params) de mongo
    _getOptions(query = {}) {
        let options = {};

        if(query.sort) {
            options.sort = [[query.sort, 1]];
            if(query.sortOrder && query.sortOrder === 'asc')
                options.sort[0][1] = -1;
        }
        if(query.pageItems && !isNaN(+query.pageItems) && +query.pageItems > 0){
            options.limit = Math.ceil(Math.abs(query.pageItems));
        }
        if(query.page && !isNaN(+query.page) && +query.page > 0){
            let page = Math.ceil(Math.abs(query.page));
            if(page === 1) {
                options.limit = options.limit ? options.limit : 10;
            } else {
                options.skip = (page * options.limit)-1;
            }
        }
        if(query.search) options.filter = {name: {$regex: query.search, $options: "gi"}};

        if(this.keys) options.project = this.keys
            .reduce((t, k) => Object.assign(t, {[`${k}`]: 1}), {});

        return options;
    }
}

module.exports = Controller;
