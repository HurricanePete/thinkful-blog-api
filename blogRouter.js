const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

BlogPosts.create('Train Travel', 'A review of traveling by train', 'ZeePete', 'August 8, 2017');
BlogPosts.create('Bus Travel', 'A negative review of bus travel', 'ZeePete');

router.get('/', (req, res) => {
	res.json(BlogPosts.get());
})

router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	const item = BlogPosts.create(req.body.name, req.body.content, req.body.author, req.body.publishDate);
	res.status(201).json(item);
});

router.delete('/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleted blog post with ID: \`${req.params.id}\``);
	res.status(204).end();
})

router.put('/:id', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	if (req.params.id !== req.body.id) {
		const message = `The reqested id \`${req.params.id}\` does not match the update request for id \`${req.body.id}\``;
		console.error(message);
		return res.status(400).send(message);
	}
	console.log(`Updating blog ID: \`${req.params.id}\``);
	BlogPosts.update({
		id: req.params.id,
		name: req.body.name,
		content: req.body.content,
		author: req.body.author,
		publishDate: req.body.publishDate
	});
	res.status(204).end();
});

module.exports = router;