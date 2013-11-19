require(['../../app/scripts/main'], function(config) {

	// alter basepath for tests
	config.baseUrl = '../app/mods';

	// setup global require config
	require.config(config);

	// pull down tests and execute jasmine
	require(["App/tests/app-spec",], function() {

		jasmineEnv.execute();

	});

});