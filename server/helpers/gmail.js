const nodemailer = require("nodemailer");

const sendOrderConfirmationEmail = async (order) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Online Clothing Store Nepal" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_RECEIVERS.split(',').map(email => email.trim()),          // main recipients
    // cc: process.env.EMAIL_CC || "",           // optional visible copy
    // bcc: process.env.EMAIL_BCC || "",         // optional hidden copy
    subject: `🛍️ New COD Order - ${order?.addressInfo?.fullName || "Customer"}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #2e2e2e;">🧾 New Order Received</h2>
        <hr style="margin-bottom: 15px;">
        
        <h3>Customer Info</h3>
        <p><strong>Name:</strong> ${order?.addressInfo?.fullName}</p>
        <p><strong>Phone:</strong> ${order?.addressInfo?.phone}</p>
        <p><strong>Address:</strong> ${order?.addressInfo?.address}</p>
        <p><strong>Payment Method:</strong> ${order?.paymentMethod}</p>

        <h3 style="margin-top: 20px;">🛍️ Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 8px; border: 1px solid #ddd;">Product</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Color</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Qty</th>
            </tr>
          </thead>
          <tbody>
            ${order?.cartItem.map(item => `
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.title}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.color}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <p style="margin-top: 20px;"><strong>Total Amount:</strong> Rs. ${order?.totalAmount}</p>
        <hr>
        <p style="font-size: 12px; color: #777;">This order was placed from your STYLE ME website.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOrderConfirmationEmail };