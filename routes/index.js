module.exports = {
	getHomePage: (req, res) => {
		let query = "SELECT * FROM `electirc` ORDER BY id ASC"; // query database to get all the players

		// execute query
		db.query(query, (err, result) => {
			if (err) {
				// res.redirect('/');
			}
			res.render('index.ejs', {
				title: 'Welcome to Tak Vehicles | View Vehicles',
				players: result
			});
		});
	},
};