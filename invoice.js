const { model, Schema, Types } = require("mongoose");

const invoiceItemSchema = new Schema({
    id: {
        type: String,
        default: () => new Types.ObjectId().toString(),
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    quantity: {
        type: Types.Decimal128,
        required: true,
        validate: {
            validator: (value) => value > 0,
            message: "Quantity must be greater than zero."
        }
    },
    price: {
        type: Types.Decimal128,
        required: true,
        validate: {
            validator: (value) => value > 0,
            message: "Price must be greater than zero."
        }
    },
    amount: {
        type: Types.Decimal128,
        required: true,
        validate: {
            validator: (value) => value > 0,
            message: "Amount must be greater than zero."
        },
        set: function(value) {
            return value || this.quantity * this.price;
        }
    }
});

const invoiceBillSundrySchema = new Schema({
    id: {
        type: String,
        default: () => new Types.ObjectId().toString(),
        required: true
    },
    billSundryName: {
        type: String,
        required: true
    },
    amount: {
        type: Types.Decimal128,
        required: true,
        validate: {
            validator: (value) => value !== 0,
            message: "Amount cannot be zero."
        }
    }
});

const invoiceSchema = new Schema({
    id: {
        type: String,
        default: () => new Types.ObjectId().toString(),
        required: true
    },
    date: {
        type: String,
        required: true
    },
    invoiceNumber: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    customerName: {
        type: String,
        required: true
    },
    billingAddress: {
        type: String,
        required: true
    },
    shippingAddress: {
        type: String,
        required: true
    },
    GSTIN: {
        type: String,
        required: true
    },
    totalAmount: {
        type: Types.Decimal128,
        required: true,
        set: function(value) {
            return value || this.invoiceItems.reduce((total, item) => total + item.amount, 0) + this.invoiceBillSundry.reduce((total, billSundry) => total + billSundry.amount, 0);
        }
    },
    invoiceItems: [invoiceItemSchema],
    invoiceBillSundry: [invoiceBillSundrySchema]
});
module.exports = model("Invoice", invoiceSchema)
