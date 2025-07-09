export default function ChallanTypeSelector({ challanType, setChallanType }) {
  return (
    <div className="mb-4">
      <h5>Invoice/Challan Type</h5>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="challanType"
          value="Tax Invoice"
          checked={challanType === "Tax Invoice"}
          onChange={(e) => setChallanType(e.target.value)}
        />
        <label className="form-check-label">Tax Invoice</label>
      </div>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="challanType"
          value="Retail Invoice"
          checked={challanType === "Retail Invoice"}
          onChange={(e) => setChallanType(e.target.value)}
        />
        <label className="form-check-label">Retail Invoice</label>
      </div>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          name="challanType"
          value="Delivery Challan"
          checked={challanType === "Delivery Challan"}
          onChange={(e) => setChallanType(e.target.value)}
        />
        <label className="form-check-label">Vechile Challan</label>
      </div>
    </div>
  );
}
