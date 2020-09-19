const Jasmine = require('jasmine');
const request = require("request");
const base_url = "http://localhost:3000/";

describe("POST / ", function() {
        it("Generate token", function(done) {
            request.post(base_url + 'api/token', {'email': 'arafet@gmail.com'} , function(error, response, body) {
                expect(response).not.toBeNull();
                console.log(response.body);
                done();
            });
        });
    });

describe("POST /" , function() {
    it("Justify text", function(done) {
        var options = {
            url: base_url + 'api/justify',
            headers: {'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFyYWZldC5henphYmlAZ21haWwuY29tIiwiaWF0IjoxNjAwNTE1NjM2LCJleHAiOjE2MDA4NzU2MzZ9.Ne7gga6-vWEqKuVZ-7zeJQ_ILQYWw66iuz8kxHaayyo'}
        };
        request.post(options, 'Longtemps, je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte, mes yeux se fermaient si vite que je n’avais pas le temps de me dire: «Je m’endors.» Et, une demi-heure après, la pensée qu’il était temps de chercher le sommeil m’éveillait; je voulais poser le volume que je croyais avoir dans les mains et souffler ma lumière; je n’avais pas cessé en dormant de faire des réflexions sur ce que je venais de lire, mais ces réflexions avaient pris un tour un peu particulier; il me semblait que j’étais moi-même ce dont parlait l’ouvrage: une église, un quatuor, la rivalité de François Ier et de Charles-Quint.' , function(error, response, body) {
            expect(response).not.toBeNull();
            // expect(response.statusCode).toBe(200);
            done();
        });
    });
});
describe("GET /" , function() {
    it(" Get All Requests", function(done) {
        var options = {
            url: base_url + 'api/justify',
        };
        request.post(base_url + 'api', function(error, response, body) {
            expect(response).not.toBeNull();
            done();
        });
    });
});

/*
Jasmine.onComplete(function (passed) {
     if (passed) {
         console.log('All specs have passed*******************');
     } else {
         console.log('At least one spec has failed------------------');
     }
 });
*/
