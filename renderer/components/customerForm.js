export default function CustomerForm({ customer, setCustomer }) {
  return (
    <div className="mb-4">
      <h5>Customer Details</h5>
      <input
        className="form-control mb-2"
        type="text"
        placeholder="Customer Name"
        value={customer.name}
        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
      />
      <input
        className="form-control mb-2"
        type="text"
        placeholder="Phone Number"
        value={customer.phone}
        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
      />
      <input
        className="form-control"
        type="email"
        placeholder="Email"
        value={customer.email}
        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
      />
    </div>
  );
}
