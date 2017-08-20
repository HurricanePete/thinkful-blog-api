const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Blogs List', function() {
	before(function() {
		return runServer();
	});
	after(function() {
		return closeServer();
	});

	it('should return a list of existing blog posts', function() {
		return chai.request(app)
		.get('/blog-posts')
		.then(function(res) {
			res.should.have.status(200);
			res.should.be.json;
			res.body.should.be.a('array');
			res.body.should.have.length.of.at.least(1);
			const expectedKeys = ['title', 'content', 'author'];
			res.body.forEach(function(item) {
				item.should.be.a('object');
				item.should.include.keys(expectedKeys);
			});
		});
	});

	it('should create a new post', function() {
		const newPost = {
			title: 'There\'s something about Jerry',
			content: 'Testing testing testing',
			author: 'Philip Testman',
			publishDate: 'January 1, 0001'
		 };
		 return chai.request(app)
		 .post('/blog-posts')
		 .send(newPost)
		 .then(function(res) {
		 	res.should.have.status(201);
		 	res.should.be.json;
		 	res.body.should.be.a('object');
		 	res.body.should.contain.keys('id', 'title', 'content', 'author', 'publishDate');
		 	res.body.id.should.not.be.null;
		 	res.body.title.should.equal(newPost.title);
		 	res.body.content.should.equal(newPost.content);
		 	res.body.author.should.equal(newPost.author);
		 	res.body.publishDate.should.equal(newPost.publishDate);
		 });
	});

	it('should update an existing item', function() {
		const updateData = {
			title: 'This shouldn\'t be a required field',
			content: 'Test update',
			author: 'Testy McTesterson'
		}
		return chai.request(app)
		.get('/blog-posts')
		.then(function(res) {
			updateData.id = res.body[0].id;
			return chai.request(app)
			.put(`/blog-posts/${updateData.id}`)
			.send(updateData)
		})
		.then(function(res) {
			res.should.have.status(204);
		});
	});

	it('should delete an existing item', function() {
		return chai.request(app)
		.get('/blog-posts')
		.then(function(res) {
			const blogId = res.body[0].id;
			return chai.request(app)
			.delete(`/blog-posts/${blogId}`)
		})
		.then(function(res) {
			res.should.have.status(204);
		});
	});
});