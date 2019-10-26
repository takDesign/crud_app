const fs = require('fs');

module.exports = {
	addPlayerPage: (req, res) => {
		res.render('add-player.ejs', {
			title: 'Welcome to Tak Vehicles | Add a new vehicles',
			message: ''
		});
	},
	addPlayer: (req, res) => {
		if (!req.files) {
			return res.status(400).send("No files were uploaded.");
		}

		let message = '';
		let name = req.body.name;
		let product_number = req.body.product_number;
		let price = req.body.price;
		// console.log(price);
		let uploadedFile = req.files;
		// console.log(uploadedFile);
		let image_name = uploadedFile.image.name;
		// console.log("image mimetype: " + uploadedFile.image.mimetype);
		let fileExtension = uploadedFile.image.mimetype.split('/')[1];
		image_name = name + '.' + fileExtension;

		let usernameQuery = "SELECT * FROM `electric` WHERE name = '" + name + "'";
		// console.log(nameQuery);

		db.query(usernameQuery, (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}
			if (result.length > 0) {
				message = 'Name already exists';
				res.render('add-player.ejs', {
					message,
					title: 'Welcome to Tak Vehicles | View Vehicles'
				});
			} else {
				// check the filetype before uploading it
				if (uploadedFile.image.mimetype === 'image/png' || uploadedFile.image.mimetype === 'image/jpeg' || uploadedFile.image.mimetype === 'image/gif' || uploadedFile.image.mimetype === 'image/jpg') {
					// upload the file to the /public/assets/img directory
					uploadedFile.image.mv(`public/assets/images/${image_name}`, (err) => {
						if (err) {
							return res.status(500).send(err);
						}
						// send the player's details to the database
						let query = "INSERT INTO `electric` (name, product_number, price, image) VALUES ('" +
							name + "', '" + product_number + "', '" + price + "', '" + image_name + "')";
						db.query(query, (err, result) => {
							if (err) {
								return res.status(500).send(err);
							}
							res.redirect('/');
						});
					});
				} else {
					message = "Invalid File format. Only 'gif','jpg', 'jpeg' and 'png' images are allowed.";
					res.render('add-player.ejs', {
						message,
						title: 'Welcome to Tak Vehicles | View Vehicles'
					});
				}
			}
		});
	},
	editPlayerPage: (req, res) => {
		let playerId = req.params.id;
		let query = "SELECT * FROM `electric` WHERE id = '" + playerId + "' ";
		db.query(query, (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}
			res.render('edit-player.ejs', {
				title: 'Edit Vehicle',
				player: result[0],
				message: ''
			});
		});
	},
	editPlayer: (req, res) => {
		let playerId = req.params.id;
		let name = req.body.name;
		let product_number = req.body.product_number;
		let price = req.body.price;

		let query = "UPDATE `electric` SET `name` = '" + name + "', `product_number` = '" + product_number + "', `price` = '" + price + "' WHERE `electric`.`id` = '" + playerId + "'";
		db.query(query, (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}
			res.redirect('/');
		});
	},
	deletePlayer: (req, res) => {
		let playerId = req.params.id;
		let getImageQuery = 'SELECT image from `electric` WHERE id = "' + playerId + '"';
		let deleteUserQuery = 'DELETE FROM electric WHERE id = "' + playerId + '"';

		db.query(getImageQuery, (err, result) => {
			if (err) {
				return res.status(500).send(err);
			}

			let image = result[0].image;

			fs.unlink(`public/assets/images/${image}`, (err) => {
				if (err) {
					return res.status(500).send(err);
				}
				db.query(deleteUserQuery, (err, result) => {
					if (err) {
						return res.status(500).send(err);
					}
					res.redirect('/');
				});
			});
		});
	}
};