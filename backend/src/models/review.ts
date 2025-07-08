import { Schema, model, Document, ObjectId, Model } from "mongoose";
import Product from "./product";


export interface IReview extends Document {
    user: ObjectId;
    product: ObjectId;
    rating: number;
    comment?: string;
    createdAt: Date;
}

interface IReviewModel extends Model<IReview> {
    calculateAverageRating(productId: ObjectId): Promise<void>;
}

const ReviewSchema = new Schema<IReview, IReviewModel>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: false,
});

ReviewSchema.statics.calculateAverageRating = async function(productId: ObjectId) {
    const result = await this.aggregate([
        { $match: { product: productId } },
        {
            $group: {
                _id: null,
                averageRating: { $avg: "$rating" },
                totalReviews: { $sum: 1 }
            }
        }
    ]);

    try {
        await Product.findByIdAndUpdate(productId, {
            averageRating: result[0]?.averageRating.toFixed(1) || 0,
            totalReviews: result[0]?.totalReviews || 0
        });
    } catch (error) {
        console.error("Error updating product rating:", error);
    }
};

ReviewSchema.post('save', async function() {
    const reviewModel = this.constructor as IReviewModel;
    await reviewModel.calculateAverageRating(this.product);
});

const Review = model<IReview, IReviewModel>("Review", ReviewSchema);

export default Review;