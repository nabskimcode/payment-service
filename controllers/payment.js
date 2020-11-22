const express = require("express");
const ejs = require("ejs");
const paypal = require("paypal-rest-sdk");
const asyncHandler = require("../middleware/async");
const Orders = require("../model/Orders");

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    // optional approach use dotenv ex: process.env.CLIENT_ID
    "xxxxxxx",
  client_secret: "xxxx",
});

exports.payment = asyncHandler(async (req, res, next) => {
  const { type, data } = req.body;

  const {
    product_title,
    details,
    price,
    size,
    productID,
    state,
    user,
    _id
  } = data;
  // handleEvent(type, data);




   // making payment 

   if (type === "OrderCreated") {
    
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:3000/api/v1/payment/success",
        cancel_url: "http://localhost:3000/api/v1/payment/cancel",
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                product_title,
                productID,
                price,
                currency: "MYR",
                quantity: size
              },
            ],
          },
          amount: {
            currency: "MYR",
            total: "25.00",
          },
          description: details,
          orderID: _id
        },
      ],
    };
  
    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            res.redirect(payment.links[i].href);
          }
        }
      }
    });

  }

  
});

exports.successfulpay= asyncHandler(async(req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  const orderId = req.body.orderID

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "MYR",
          total: "25.00",
        },
      },
    ],
  };

  paypal.payment.execute(paymentId, execute_payment_json, function (
    error,
    payment
  ) {
    if (error) {
      console.log(error.response);
     // declinedOrder(datalist)
      throw error;
    } else {
      // payment details will be stored in db
      order = await Orders.findByIdAndUpdate(orderId, { state: 'confirmed'}, {
        new: true,
        runValidators: true,
      });

      var postdata = {
        type: "OrderConfirmed",
        data: payment,
      };
      axios.post("http://localhost:8005/eventbus/events/postEvent", postdata);
      console.log(JSON.stringify(payment));
      res.send("Success");
    }
  });
});

exports.cancelorder= asyncHandler(async(req, res) => {
  const { type, data} = req.body;
var postdata = {
  type: "OrderRemoved",
  data: "Order has been canceled",
};

order = await Orders.findByIdAndUpdate(data._id, { state: 'cancelled'}, {
  new: true,
  runValidators: true,
});

//order.remove();

axios.post("http://localhost:8005/eventbus/events/postEvent", postdata);

// if refund
// var refund_details = {
//   "amount": {
//       "currency": "MYR",
//       "total": "25.00"
//   }
// },

// saleId = "3RM92092UW5126232";

// paypal.sale.refund(saleId, refund_details, function (error, refund) {
//     if (error) {
//         throw error;
//     } else {
//         console.log("Refund Sale Response");
//         console.log(JSON.stringify(refund));
//     }
//   })

res.send('Cancelled')

});  