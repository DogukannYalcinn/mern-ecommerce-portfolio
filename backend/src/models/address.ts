import { Schema } from "mongoose";

export type AddressType = {
    address: string,
    city: string,
    postalCode: string,
}

export const AddressSchema = new Schema<AddressType>({
    address: {
        type: String,
        required: [true, 'Address is required']
    },
    city: {
        type: String,
        required: [true, 'City is required']
    },
    postalCode: {
        type: String,
        required: [true, 'Postal code is required'],
    }
});