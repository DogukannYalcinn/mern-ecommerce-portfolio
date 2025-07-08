import { Schema, model, Document } from "mongoose";

type Method = {
    label: string;
    identifier: string;
    fee: number;
    description:string;
};


export interface IOrderRules extends Document {
    paymentMethods: Method[];
    deliveryMethods: Method[];
    giftWrapFee: number;
    taxRate: number;
    freeShippingThreshold:number;
}

const OrderRulesSchema = new Schema<IOrderRules>({
    paymentMethods: [
        {
            label: { type: String, required: true },
            identifier: { type: String, required: true },
            fee: { type: Number, required: true },
            description:{ type: String, required: true }
        }
    ],
    deliveryMethods: [
        {
            label: { type: String, required: true },
            identifier: { type: String, required: true },
            fee: { type: Number, required: true },
            description:{ type: String, required: true }
        }
    ],
    giftWrapFee: { type: Number },
    taxRate: { type: Number },
    freeShippingThreshold: { type: Number }
},{versionKey:false});

const OrderRules = model("OrderRules", OrderRulesSchema);

export default OrderRules;