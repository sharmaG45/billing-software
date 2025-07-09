export default function SummaryBox({ totals, gst, discount }) {
  return (
    <div className="border p-3 bg-light">
      <h5>Summary</h5>
      <p>Subtotal: ₹{totals.subtotal.toFixed(2)}</p>
      <p>GST ({gst}%): ₹{totals.gstAmount.toFixed(2)}</p>
      <p>Discount ({discount}%): ₹{totals.discountAmount.toFixed(2)}</p>
      <p><strong>Grand Total: ₹{Math.round(totals.total).toFixed(2)}</strong></p>
    </div>
  );
}
