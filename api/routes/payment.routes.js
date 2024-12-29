export const paymentRoutes = async (fastify, options) => {
    // Route for payment success
    fastify.get("/payment-success", async (request, reply) => {
      const { oid, amt, refId } = request.query;
  
      return reply.type("text/html").send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Payment Success</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 50px;
                background-color: #f0f8ff;
              }
              h1 {
                color: #28a745;
              }
              .details {
                margin-top: 20px;
                font-size: 18px;
                color: #333;
              }
            </style>
          </head>
          <body>
            <h1>Payment Successful!</h1>
            <p class="details">
              <strong>Order ID:</strong> ${oid || "N/A"}<br />
              <strong>Amount:</strong> ${amt || "N/A"}<br />
              <strong>Reference ID:</strong> ${refId || "N/A"}
            </p>
          </body>
        </html>
      `);
    });
  
    // Route for payment failure
    fastify.get("/payment-failure", async (request, reply) => {
      const { oid, amt, error } = request.query;
  
      return reply.type("text/html").send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Payment Failure</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 50px;
                background-color: #fff5f5;
              }
              h1 {
                color: #dc3545;
              }
              .details {
                margin-top: 20px;
                font-size: 18px;
                color: #333;
              }
            </style>
          </head>
          <body>
            <h1>Payment Failed</h1>
            <p class="details">
              <strong>Order ID:</strong> ${oid || "N/A"}<br />
              <strong>Amount:</strong> ${amt || "N/A"}<br />
              <strong>Error:</strong> ${error || "N/A"}
            </p>
          </body>
        </html>
      `);
    });
  };
  