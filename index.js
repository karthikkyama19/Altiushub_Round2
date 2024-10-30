const express = require("express");
const db = require("./config/database");
const model = require("./invoice");
const app = express();
const env = require("dotenv");

env.config({path:"./config/config.env"});

console.log(process.env.URL);

db();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/create", async (req, res) => {
    try {
        const invoice = new model({
            id: new Types.ObjectId().toString(),
            date: req.body.date,
            invoiceNumber: req.body.invoiceNumber,
            customerName: req.body.customerName,
            billingAddress: req.body.billingAddress,
            shippingAddress: req.body.shippingAddress,
            GSTIN: req.body.GSTIN,
            totalAmount: Types.Decimal128.fromString(req.body.totalAmount),
            invoiceItems: req.body.invoiceItems.map(item => ({
                id: new Types.ObjectId().toString(),
                itemName: item.itemName,
                quantity: Types.Decimal128.fromString(item.quantity),
                price: Types.Decimal128.fromString(item.price),
                amount: Types.Decimal128.fromString(item.amount)
            })),
            invoiceBillSundry: req.body.invoiceBillSundry.map(billSundry => ({
                id: new Types.ObjectId().toString(),
                billSundryName: billSundry.billSundryName,
                amount: Types.Decimal128.fromString(billSundry.amount)
            }))
        });
        const result = await invoice.save();
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.put("/update/:id",async (req,res)=>{
    try {
        const result = await model.findByIdAndUpdate(req.params.id, req.body, { new: true});
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
})

app.delete("/delete/:id",async(req,res)=>{
    try {
        const result =await model.findByIdAndRemove(req.params.id);
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
})

app.get("/retrieve/:id",async (req,res)=>{
    try {
        const result = await model.findById(req.params.id);
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
})

app.get("/list",async (req,res)=>{
    try {
        const result = await model.find();
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
})

app.listen(process.env.PORT, () => {
    console.log("Server started on port " + process.env.PORT);
});

