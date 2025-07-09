import { useState } from "react";
import Head from "next/head";
import CustomerForm from "../components/customerForm";
import ProductForm from "../components/productForm";
import SummaryBox from "../components/SummaryBox";
import ChallanTypeSelector from "../components/ChallanTypeSelector";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import Header from "../components/header";
import Footer from "../components/footer";
import HistorySection from "../components/historySection";

export default function Dashboard() {
  // Sidebar state - what section is active
  const [activeSection, setActiveSection] = useState("createInvoice");

  // Invoice form states
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "" });
  const [product, setProduct] = useState({ name: "", description: "", qty: "", price: "" });
  const [products, setProducts] = useState([]);
  const [gst] = useState(18);
  const [discount, setDiscount] = useState(0);
  const [challanType, setChallanType] = useState("Tax Invoice");
  const [driverDetails, setDriverDetails] = useState({ name: "", licence: "", vehicle: "" });

  const addProduct = () => {
    if (!product.name || !product.qty || !product.price) return;
    setProducts([
      ...products,
      {
        ...product,
        qty: Number(product.qty),
        price: Number(product.price),
        description: product.description || "-",
      },
    ]);
    setProduct({ name: "", description: "", qty: "", price: "" });
  };

  const calculateTotal = () => {
    const subtotal = products.reduce((sum, p) => sum + p.qty * p.price, 0);
    const gstAmount = challanType === "Retail Invoice" ? 0 : subtotal * (gst / 100);
    const discountAmount = subtotal * (discount / 100);
    const total = subtotal + gstAmount - discountAmount;
    return { subtotal, gstAmount, discountAmount, total };
  };

  const saveToFirebase = async () => {
    try {
      const invoiceData = {
        type: challanType,
        customer: challanType === "Delivery Challan" ? null : customer,
        products: challanType === "Delivery Challan" ? [] : products,
        discount,
        gst: challanType === "Retail Invoice" ? 0 : gst,
        driverDetails: challanType === "Delivery Challan" ? driverDetails : null,
        totals: calculateTotal(),
        date: Timestamp.now(),
      };
      const docRef = await addDoc(collection(db, challanType), invoiceData);
      console.log("Invoice saved with ID:", docRef.id);
    } catch (error) {
      console.error("Error saving invoice:", error);
    }
  };

  // Convert number to words (Indian system)
  function convertNumberToWords(num) {
    const a = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    if ((num = num.toString()).length > 9) return "Overflow";

    const n = ("000000000" + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{3})$/);
    if (!n) return;

    let str = "";
    str += n[1] != 0 ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + " Crore " : "";
    str += n[2] != 0 ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + " Lakh " : "";
    str += n[3] != 0 ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + " Thousand " : "";
    str += n[4] != 0 ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + " " : "";

    return str.trim();
  }

  const handlePrint = () => {
    if (
      challanType === "Delivery Challan" &&
      (!driverDetails.name || !driverDetails.licence || !driverDetails.vehicle)
    ) {
      alert("Please fill all driver details for Delivery Challan.");
      return;
    }

    const totals = calculateTotal();
    const invoiceNo = `INV-${Date.now()}`;

    const shopDetails = {
      name: "Paudhawala Nursery",
      address: "Near By Reesabh Automobile, Jadhua, NH-19 Hajipur, Bihar",
      email: "support@paudhwala.com",
      phone: "+91-9955859697",
      gstin: "27ABCDE1234F2Z5",
    };

    const content = `
<html>
<head>
  <title>${challanType}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; font-size: 14px; color: #000; }
    h2 { text-align: center; text-transform: uppercase; margin-bottom: 20px; }
    .header-section { display: flex; justify-content: space-between; margin-bottom: 20px; }
    .shop-details, .customer-details { width: 48%; }
    .shop-details p, .customer-details p { margin: 2px 0; }
    .invoice-info { margin-bottom: 20px; border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 10px 0; display: flex; justify-content: space-between; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
    th, td { border: 1px solid #000; padding: 8px 6px; text-align: center; }
    th { background-color: #f2f2f2; }
    .right-align { text-align: right; padding-right: 10px; }
    .signature-stamp { margin-top: 50px; display: flex; justify-content: space-between; }
    .signature, .stamp { text-align: center; width: 200px; }
    .signature div { border-top: 1px solid #000; margin-top: 60px; width: 100%; height: 1px; }
    .stamp div { border: 1px dashed #000; width: 100px; height: 100px; margin: 20px auto 0; }
  </style>
</head>
<body>

  <div class="header-section">
    <div class="shop-details">
      <p><strong>${shopDetails.name}</strong></p>
      <p>${shopDetails.address}</p>
      <p>Email: ${shopDetails.email}</p>
      <p>Phone: ${shopDetails.phone}</p>
    </div>
    ${challanType === "Delivery Challan"
        ? ""
        : `<div class="customer-details">
            <p><strong>Customer Details</strong></p>
            <p>Name: ${customer.name || "-"}</p>
            <p>Email: ${customer.email || "-"}</p>
            <p>Phone: ${customer.phone || "-"}</p>
          </div>`
      }
  </div>

  <div class="invoice-info">
    <div>GSTIN: ${shopDetails.gstin}</div>
    <div>Invoice No: ${invoiceNo}</div>
    <div>Date: ${new Date().toLocaleString()}</div>
  </div>

  ${challanType === "Delivery Challan"
        ? `<p><strong>Driver Name:</strong> ${driverDetails.name}</p>
         <p><strong>Licence No:</strong> ${driverDetails.licence}</p>
         <p><strong>Vehicle No:</strong> ${driverDetails.vehicle}</p>`
        : `
        <table>
          <thead>
            <tr>
              <th>S.N</th>
              <th>Product Name</th>
              <th>Description</th>
              <th>Qty</th>
              <th>Price (₹)</th>
              <th>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${products.length === 0
          ? `<tr><td colspan="6">No products added</td></tr>`
          : products
            .map(
              (p, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${p.name}</td>
                <td>${p.description || "-"}</td>
                <td>${p.qty}</td>
                <td>${p.price.toFixed(2)}</td>
                <td>${(p.qty * p.price).toFixed(2)}</td>
              </tr>
            `
            )
            .join("")
        }
          </tbody>
        </table>

        <div style="display: flex; justify-content: space-between; margin-top: 30px; gap: 20px;">
          <div style="width: 55%;">
            <h4>Terms & Conditions</h4>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Subject to jurisdiction only.</li>
            </ul>

            <p style="margin-top: 15px;"><strong>GST Breakdown:</strong></p>
            <p>IGST ${totals.subtotal.toFixed(2)} × ${gst}% = ₹${totals.gstAmount.toFixed(2)}</p>

            <p style="margin-top: 15px;"><strong>Grand Total (in words):</strong></p>
            <p>${convertNumberToWords(Math.round(totals.total))} only</p>
          </div>

          <div style="width: 40%;">
            <table style="width: 100%; font-size: 14px;">
              <tr>
                <td style="text-align: right;"><strong>Subtotal:</strong></td>
                <td style="text-align: right;">₹${totals.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="text-align: right;"><strong>Discount (${discount}%):</strong></td>
                <td style="text-align: right;">₹${totals.discountAmount.toFixed(2)}</td>
              </tr>
              ${challanType === "Tax Invoice"
          ? `<tr>
                      <td style="text-align: right;"><strong>GST (${gst}%):</strong></td>
                      <td style="text-align: right;">₹${totals.gstAmount.toFixed(2)}</td>
                    </tr>`
          : ""
        }
              <tr>
                <td style="text-align: right;"><strong>Grand Total:</strong></td>
                <td style="text-align: right;"><strong>₹${totals.total.toFixed(2)}</strong></td>
              </tr>
            </table>
          </div>
        </div>
      `
      }

  <div class="signature-stamp">
    <div class="signature">
      <p><strong>Authorized Signature</strong></p>
      <div></div>
    </div>
    <div class="stamp">
      <p><strong>Stamp</strong></p>
      <div></div>
    </div>
  </div>

  <script>window.print();</script>
</body>
</html>
`;

    const newWin = window.open();
    newWin.document.write(content);
    newWin.document.close();

    saveToFirebase();
  };

  // Sidebar menu
  const menuItems = [
    { key: "createInvoice", label: "Create Invoice/Challan" },
    { key: "history", label: "History" },
  ];

  return (
    <>
      <Head>
        <title>Invoice & Challan Dashboard</title>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
      </Head>

      <Header />

      <div className="container-fluid" style={{ minHeight: "90vh" }}>
        <div className="row">
          {/* Sidebar */}
          <nav
            className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
            style={{ minHeight: "90vh", borderRight: "1px solid #ddd" }}
          >
            <div className="position-sticky pt-3">
              <ul className="nav flex-column">
                {menuItems.map((item) => (
                  <li key={item.key} className="nav-item">
                    <button
                      className={`nav-link btn btn-link w-100 text-start ${activeSection === item.key ? "active fw-bold text-primary" : "text-secondary"
                        }`}
                      onClick={() => setActiveSection(item.key)}
                      style={{ textDecoration: "none" }}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Main Content */}
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
            {activeSection === "history" && <HistorySection />}

            {activeSection === "createInvoice" && (
              <>
                <h1 className="text-center mb-4 fw-bold display-5 text-primary">
                  <i className="fas fa-file-invoice me-2 text-success"></i>
                  Paudhawala <span className="text-success">Invoice & Challan</span> Generator
                </h1>

                {/* Show Customer Form only if NOT Delivery Challan */}
                {challanType !== "Delivery Challan" && (
                  <CustomerForm customer={customer} setCustomer={setCustomer} />
                )}

                <ChallanTypeSelector challanType={challanType} setChallanType={setChallanType} />

                {/* Show Driver Details only for Delivery Challan */}
                {challanType === "Delivery Challan" && (
                  <div className="mb-3">
                    <h5>Driver Details</h5>
                    <div className="row g-2">
                      <div className="col-md-4">
                        <label>Driver Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={driverDetails.name}
                          onChange={(e) =>
                            setDriverDetails({ ...driverDetails, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="col-md-4">
                        <label>Licence Number</label>
                        <input
                          type="text"
                          className="form-control"
                          value={driverDetails.licence}
                          onChange={(e) =>
                            setDriverDetails({ ...driverDetails, licence: e.target.value })
                          }
                        />
                      </div>
                      <div className="col-md-4">
                        <label>Vehicle Number</label>
                        <input
                          type="text"
                          className="form-control"
                          value={driverDetails.vehicle}
                          onChange={(e) =>
                            setDriverDetails({ ...driverDetails, vehicle: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Show Product Form only if NOT Delivery Challan */}
                {challanType !== "Delivery Challan" && (
                  <ProductForm
                    product={product}
                    setProduct={setProduct}
                    addProduct={addProduct}
                    products={products}
                    setProducts={setProducts}
                  />
                )}

                {/* Show Discount only if NOT Delivery Challan */}
                {challanType !== "Delivery Challan" && (
                  <div className="mb-3">
                    <label>Discount (%)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                    />
                  </div>
                )}

                {/* Show Summary only if NOT Delivery Challan */}
                {challanType !== "Delivery Challan" && (
                  <SummaryBox totals={calculateTotal()} gst={gst} discount={discount} />
                )}

                <button className="btn btn-success w-100 mt-4" onClick={handlePrint}>
                  Print & Save Invoice
                </button>
              </>
            )}
          </main>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .sidebar .nav-link.active {
          background-color: #e9f5ec;
          border-left: 4px solid #198754;
          color: #198754 !important;
        }
        .sidebar .nav-link {
          font-size: 1.1rem;
          padding-left: 1.25rem;
        }
        .btn-link:hover {
          text-decoration: none;
        }
      `}</style>
    </>
  );
}
