import { useState } from "react";

export default function ProductForm({ product, setProduct, addProduct, products, setProducts }) {
  // Handler to remove product by index
  const removeProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  // Handler for Add button with validation and clearing inputs
  const handleAddProduct = () => {
    if (!product.name || !product.qty || !product.price) {
      alert("Please fill product name, quantity, and price.");
      return;
    }
    addProduct();
    // Clear form after adding
    setProduct({ name: "", qty: "", price: "", description: "" });
  };

  return (
    <div className="mb-4">
      <h5>Add Product</h5>
      <div className="row g-2">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Product Name"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Quantity"
            value={product.qty}
            onChange={(e) => setProduct({ ...product, qty: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Price"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Description (optional)"
            value={product.description || ""}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={handleAddProduct}>
            Add
          </button>
        </div>
      </div>

      {products.length > 0 && (
        <div className="mt-4">
          <h6>Product List</h6>
          <table className="table table-bordered table-sm">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Description</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{p.name}</td>
                  <td>{p.qty}</td>
                  <td>₹{Number(p.price).toFixed(2)}</td>
                  <td>{p.description || "-"}</td>
                  <td>₹{(p.qty * p.price).toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => removeProduct(i)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
