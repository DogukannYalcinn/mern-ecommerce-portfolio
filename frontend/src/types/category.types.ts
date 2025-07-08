export type CategoryType = {
  _id: string;
  name: string;
  children: CategoryType[];
  imageUrl: string;
  slug: string;
};
