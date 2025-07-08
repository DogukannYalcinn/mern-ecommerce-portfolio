import { Schema, model, Document } from "mongoose";

export interface ISlider extends Document {
  title: string;
  description: string;
  imageUrl: string;
  subtitle: string;
  link: string;
}

const SliderSchema = new Schema<ISlider>(
  {
    title: { type: String, required: true, lowercase: true },
    description: { type: String, required: true, lowercase: true },
    subtitle: { type: String, required: true, lowercase: true },
    imageUrl: { type: String, required: true, lowercase: true },
    link: { type: String, required: true },
  },
  { versionKey: false },
);

const Slider = model("Slider", SliderSchema);

export default Slider;
