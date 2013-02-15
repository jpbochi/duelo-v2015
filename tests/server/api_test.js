define(function (require) {
  module('server/api');

	test('GET /api', function () {
		stop();

		$.get('/api').always(function () {
			start();
		}).fail(function (jqXHR, textStatus, errorThrown) {
			ok(false, ['GET /api failed with: ', jqXHR.status, textStatus, errorThrown].join(', '));
		}).done(function (data, textStatus, jqXHR) {
			equal(jqXHR.status, 200, 'status == 200');

			deepEqual(data, [ { rel: 'self', href: '/api' }]);
		});
	});
});