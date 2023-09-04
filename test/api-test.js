const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Replace with the actual path to your Express app
const { expect } = chai;

chai.use(chaiHttp);

// Describe your test suite
describe('API Tests', () => {
  // Define a variable to store an item ID for testing
  let itemId = '';

  // Test the POST /item/add route
  describe('POST /item/add', () => {
    it('should add a new item', (done) => {
      const newItem = {
        itemName: 'Test Item',
        itemPrice: 10.99,
        itemCategory: 'Test Category',
        itemDescription: 'Test Description',
      };

      chai
        .request(app)
        .post('/item/add')
        .send(newItem)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          expect(res.body.success).to.be.true;
          expect(res.body.message).to.equal('Item added successfully');
          expect(res.body.data).to.be.an('object');
          expect(res.body.data).to.have.property('itemId');
          itemId = res.body.data.itemId; // Store the item ID for later tests
          done();
        });
    });
  });

  // Test the GET /item/fetch/:id route
  describe('GET /item/fetch/:id', () => {
    it('should retrieve an item by ID', (done) => {
      chai
        .request(app)
        .get(`/item/fetch/${itemId}`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          expect(res.body.message).to.equal('Item retrieved successfully');
          expect(res.body.data).to.be.an('object');
          done();
        });
    });

    it('should return a 404 status if item ID is not found', (done) => {
      const invalidId = 'invalid_id';

      chai
        .request(app)
        .get(`/item/fetch/${invalidId}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.success).to.be.false;
          expect(res.body.message).to.equal('Item not found');
          done();
        });
    });
  });

// ...

// Test the PUT /item/update/:id route
describe('PUT /item/update/:id', () => {
    it('should update an item by ID', (done) => {
      const updatedItem = {
        itemName: 'Updated Item Name',
        itemPrice: 19.99,
        itemCategory: 'Updated Category',
        itemDescription: 'Updated Description',
      };
  
      chai
        .request(app)
        .put(`/item/update/${itemId}`)
        .send(updatedItem)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          expect(res.body.message).to.equal('Item updated successfully');
          expect(res.body.data).to.be.an('object');
          expect(res.body.data.itemName).to.equal(updatedItem.itemName);
          expect(res.body.data.itemPrice).to.equal(updatedItem.itemPrice);
          expect(res.body.data.itemCategory).to.equal(updatedItem.itemCategory);
          expect(res.body.data.itemDescription).to.equal(updatedItem.itemDescription);
          done();
        });
    });
  
    it('should return a 404 status if item ID is not found', (done) => {
      const invalidId = 'invalid_id';
      const updatedItem = {
        itemName: 'Updated Item Name',
        itemPrice: 19.99,
        itemCategory: 'Updated Category',
        itemDescription: 'Updated Description',
      };
  
      chai
        .request(app)
        .put(`/item/update/${invalidId}`)
        .send(updatedItem)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.success).to.be.false;
          expect(res.body.message).to.equal('Item not found');
          done();
        });
    });
  });
  
  // Test the GET /item/fetch route (filtering and sorting)
  describe('GET /item/fetch', () => {
    // Test filtering by minimum item price
    it('should filter items by minimum price', (done) => {
      const minPrice = 15.0;
  
      chai
        .request(app)
        .get(`/item/fetch?minPrice=${minPrice}`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          expect(res.body.data.items).to.be.an('array');
          res.body.data.items.forEach((item) => {
            expect(item.itemPrice).to.be.at.least(minPrice);
          });
          done();
        });
    });
  
    // Test sorting by price (high to low)
    it('should sort items by price (high to low)', (done) => {
      chai
        .request(app)
        .get('/item/fetch?sort=highToLow')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          expect(res.body.data.items).to.be.an('array');
          // Check if items are sorted in descending order by price
          for (let i = 0; i < res.body.data.items.length - 1; i++) {
            expect(res.body.data.items[i].itemPrice).to.be.at.least(res.body.data.items[i + 1].itemPrice);
          }
          done();
        });
    });
  
    // Test pagination
    it('should paginate items', (done) => {
      const page = 2;
      const pageSize = 5;
  
      chai
        .request(app)
        .get(`/item/fetch?page=${page}&pageSize=${pageSize}`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          expect(res.body.data.items).to.be.an('array');
          expect(res.body.data.page).to.equal(page);
          expect(res.body.data.pageSize).to.equal(pageSize);
          done();
        });
    });

  });

  // Test the DELETE /item/delete/:id route
  describe('DELETE /item/delete/:id', () => {
    it('should delete an item by ID', (done) => {
      chai
        .request(app)
        .delete(`/item/delete/${itemId}`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.success).to.be.true;
          expect(res.body.message).to.equal('Item deleted successfully');
          done();
        });
    });

    it('should return a 404 status if item ID is not found', (done) => {
      const invalidId = 'invalid_id';

      chai
        .request(app)
        .delete(`/item/delete/${invalidId}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.success).to.be.false;
          expect(res.body.message).to.equal('Item not found');
          done();
        });
    });
  });
});
