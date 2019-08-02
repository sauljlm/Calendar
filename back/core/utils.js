const ObjectId = require('mongodb').ObjectId;

class Utils {
    // revisa que esten los datos
    static sanitize (data, keys) {
         if(Utils.isEmpty(keys)) return data;
         return keys
             .reduce((t, k) => Object.assign(t, {[`${k}`]: data[k]}), {});
    } 

    // revisa si la data esta vacida
    static isEmpty (data) {
        if(!data) throw new Error(`Invalid data: ${data}`);
        if(Array.isArray(data) || typeof data === 'string')
            return data.length === 0;
        return Object.keys(data).length === 0;
    }

    // valida el id del para el mongo
    static isId (id) {
        return typeof id === 'string' && ObjectId.isValid(id);
    }

    // 
    static pick (data, keys = []) {
        const pick = d => keys.reduce((t, k) => Object.assign(t, {[`${k}`]: d[k]}), {});
        if(Array.isArray(data)) return data.map(pick);
        return pick(data);
    }
}

module.exports = Utils;