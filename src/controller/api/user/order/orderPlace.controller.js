const {Order,OrderItems,Product,ProductHsn,OrderDeliveryStatus,sequelize} = require("../../../../models");

exports.placeOrder = async (req, res) => {
    try {
      const { user_address_id, delivery_mode, payment_status, order_type, products,data } = req?.body;
      const vendorIdArray = []; 
      const user_id = req?.user?.id
      let order_delivery_status_id = 1
      const vendorOrders = [];
      for await (const product of products) {
          const { product_id, quantity, unit_price, delivery_charges = 0, is_free = 0 } = product;
          const productDetails = await Product.findOne({
              where: { id: product_id, is_active: 1 },
              include: [{ model: ProductHsn, as: "ProductHsn" }],
          });
          const { vendor_id, tax_apply, ProductHsn: productHsnDetails } = productDetails;
          let grossPrice = quantity * unit_price;
          let taxAmount = 0
          let totalOrderPrice = 0;
          let totalDeliveryCharges = 0;
          let productHsnId = null;
          const orderItems = [];
       
          if(productHsnDetails){
            productHsnId = productHsnDetails?.id;
            const taxPercentage = productHsnDetails?.percentage || 0;
            taxAmount = grossPrice * (taxPercentage / 100);
            if(tax_apply === "included"){
              grossPrice = grossPrice - taxAmount;
            }
          }
          const netPrice = grossPrice + taxAmount;
          totalOrderPrice += netPrice + delivery_charges; 
              orderItems.push({
                    product_id,
                    quantity,
                    unit_price,
                    delivery_charges,
                    gross_price: grossPrice,
                    tax_amount: taxAmount,
                    net_price: netPrice,
                    product_hsn_id: productHsnId,
                    is_free,
                    order_delivery_status_id: 1,
              });
          totalDeliveryCharges += delivery_charges;
          if (!vendorIdArray.includes(vendor_id)) {
              vendorIdArray.push(vendor_id);
              const deliveryFilter = data.filter((databack)=>databack?.vendorId == vendor_id )
             
              const orderData = {
                  user_id,
                  vendor_id: vendor_id,
                  user_address_id,
                  delivery_charges: delivery_mode == 'pickup' ? 0 : deliveryFilter?.[0]?.delivaryCharge,
                  total_price: totalOrderPrice,
                  payment_status,
                  order_date: new Date(),
                  delivery_mode,
                  order_type,
                  order_delivery_status_id,
              };
              const createOrder = await Order.create(orderData);
              vendorOrders.push({
                  orderId: createOrder?.id,
                  vendorId: vendor_id,
              });
             const createItem =  await OrderItems.create({
                order_id: createOrder?.id,
                product_id,
                quantity,
                unit_price,
                delivery_charges,
                gross_price: grossPrice,
                tax_amount: taxAmount,
                net_price: netPrice,
                product_hsn_id: productHsnId,
                is_free,
                order_delivery_status_id: 1,
              });
              await OrderDeliveryStatus.create(
                {
                  order_id: createOrder?.id,
                  order_item_id:createItem?.id,
                  order_status_id: 1,
                })
      
              
          } else {
              const orderJson = vendorOrders.find((vendOrd) => vendOrd.vendorId == vendor_id);
              const oderId = orderJson.orderId
              const orderDetails = await Order.findByPk(oderId)
              let delivery_charges_sum = parseFloat(orderDetails?.delivery_charges) + parseFloat(totalDeliveryCharges)
              let total_price_sum  = parseFloat(orderDetails?.total_price) +  parseFloat(totalOrderPrice)
              await orderDetails.update({
                total_price: total_price_sum
              })
              const createItem = await OrderItems.create({
                order_id: oderId,
                product_id,
                quantity,
                unit_price,
                delivery_charges,
                gross_price: grossPrice,
                tax_amount: taxAmount,
                net_price: netPrice,
                product_hsn_id: productHsnId,
                is_free,
                order_delivery_status_id: 1,
              });
         
              await OrderDeliveryStatus.create(
                {
                  order_id: oderId,
                  order_item_id:createItem?.id,
                  order_status_id: 1,
                })
          }
      }
      return res.status(201).json({
          status: true,
          message: "Order placed successfully",
          status_code: 201
      })
    } catch (error) {
        console.error("Error placing order:", error);
        const status = error?.status || 500;
        const message = error?.message || "INTERNAL_SERVER_ERROR";
        return res.status(status).json({
            message,
            status: false,
            status_code: status,
        });
    }
};
