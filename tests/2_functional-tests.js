const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
let idTest = '';

suite('Functional Tests', function () {
  suite('POST request to /api/issues/{project}', () => {
    test('Create an issue with every field', done => {
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title Chai Test',
          issue_text: 'Create an issue with every field',
          created_by: 'ChaiTest',
          assigned_to: 'Mocha',
          status_text: 'test all fields'
        })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.body.issue_title, 'Title Chai Test')
          assert.equal(res.body.issue_text, 'Create an issue with every field')
          assert.equal(res.body.created_by, 'ChaiTest')
          assert.equal(res.body.assigned_to, 'Mocha')
          assert.equal(res.body.status_text, 'test all fields')
          assert.equal(res.body.open, true)
          assert.property(res.body, '_id')
          assert.property(res.body, 'created_on')
          assert.property(res.body, 'updated_on')
          idTest = res.body._id;
          done()
        })
    })

    test('Create an issue with only required fields', done => {
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title Chai Test 2',
          issue_text: 'Create an issue with only required fields',
          created_by: 'ChaiTest',
        })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.equal(res.body.issue_title, 'Title Chai Test 2')
          assert.equal(res.body.issue_text, 'Create an issue with only required fields')
          assert.equal(res.body.created_by, 'ChaiTest')
          assert.equal(res.body.assigned_to, '')
          assert.equal(res.body.status_text, '')
          assert.equal(res.body.open, true)
          assert.property(res.body, '_id')
          assert.property(res.body, 'created_on')
          assert.property(res.body, 'updated_on')
          done()
        })
    })

    test('Create an issue with missing required fields', done => {
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title Chai Test 3',
          issue_text: 'Create an issue with missing required fields'
        })
        .end((err, res) => {
          assert.equal(res.body.error, 'required field(s) missing')
          done()
        })
    })
  })

  suite('GET request to /api/issues/{project}', () => {
    test('View issues on a project', done => {
      chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.isArray(res.body)
          assert.property(res.body[0], '_id')
          assert.property(res.body[0], 'issue_title')
          assert.property(res.body[0], 'issue_text')
          assert.property(res.body[0], 'created_by')
          assert.property(res.body[0], 'assigned_to')
          assert.property(res.body[0], 'open')
          assert.property(res.body[0], 'status_text')
          assert.property(res.body[0], 'created_on')
          assert.property(res.body[0], 'updated_on')
          done()
        })
    })

    test('View issues on a project with one filter', done => {
      chai.request(server)
        .get('/api/issues/test')
        .query({ created_by: 'ChaiTest' })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.isArray(res.body)
          assert.equal(res.body[0].created_by, 'ChaiTest')
          done()
        })
    })

    test('View issues on a project with multiple filters', done => {
      chai.request(server)
        .get('/api/issues/test')
        .query({ created_by: 'ChaiTest', assigned_to: 'Mocha' })
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.isArray(res.body)
          assert.equal(res.body[0].created_by, 'ChaiTest')
          assert.equal(res.body[0].assigned_to, 'Mocha')
          done()
        })
    })
  })

  suite('PUT request to /api/issues/{project}', () => {
    test('Update one field on an issue', done => {
      chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: idTest,
          issue_title: 'Title Chai Test update'
        })
        .end((err, res) => {
          assert.equal(res.body.result, 'successfully updated')
          assert.equal(res.body._id, idTest)
          done()
        })
    })

    test('Update multiple fields on an issue', done => {
      chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: idTest,
          issue_text: 'Create an issue with every field update',
          status_text: 'test all fields update'
        })
        .end((err, res) => {
          assert.equal(res.body.result, 'successfully updated')
          assert.equal(res.body._id, idTest)
          done()
        })
    })

    test('Update an issue with missing _id', done => {
      chai.request(server)
        .put('/api/issues/test')
        .send({})
        .end((err, res) => {
          assert.equal(res.body.error, 'missing _id')
          done()
        })
    })

    test('Update an issue with no fields to update', done => {
      chai.request(server)
        .put('/api/issues/test')
        .send({ _id: idTest })
        .end((err, res) => {
          assert.equal(res.body.error, 'no update field(s) sent')
          assert.equal(res.body._id, idTest)
          done()
        })
    })

    test('Update an issue with an invalid _id', done => {
      chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: 'invalid_id',
          issue_text: 'Create an issue with every field update'
        })
        .end((err, res) => {
          assert.equal(res.body.error, 'could not update')
          assert.equal(res.body._id, 'invalid_id')
          done()
        })
    })
  })

  suite('DELETE request to /api/issues/{project}', () => {
    test('Delete an issue', done => {
      chai.request(server)
        .delete('/api/issues/test')
        .send({ _id: idTest })
        .end((err, res) => {
          assert.equal(res.body.result, 'successfully deleted')
          assert.equal(res.body._id, idTest)
          done()
        })
    })

    test('Delete an issue with an invalid _id', done => {
      chai.request(server)
        .delete('/api/issues/test')
        .send({ _id: idTest })
        .end((err, res) => {
          assert.equal(res.body.error, 'could not delete')
          assert.equal(res.body._id, idTest)
          done()
        })
    })

    test('Delete an issue with missing _id', done => {
      chai.request(server)
        .delete('/api/issues/test')
        .send({})
        .end((err, res) => {
          assert.equal(res.body.error, 'missing _id')
          done()
        })
    })
  })
});