var assert = require('assert');
var {saveDogPictures} = require('./../src/dogs');

describe('Dog tests', function() {
    it('should save dog image files', function (done) {
        saveDogPictures()
            .then(dgfile=>{
                console.log(dgfile);
                done();
            }, done);
    })
});
