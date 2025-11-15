// app/products/[id]/page.jsx
import ProductDetails from "./ProductDetails";

export default async function Page({ params }) {
  const resolvedParams = await params; // unwrap the promise
  return <ProductDetails id={resolvedParams.id} />;
}
