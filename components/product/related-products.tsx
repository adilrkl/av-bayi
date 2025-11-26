import { ProductCard } from "./product-card"

interface RelatedProductsProps {
    products: any[]
}

export function RelatedProducts({ products }: RelatedProductsProps) {
    if (products.length === 0) return null

    return (
        <section className="py-12 border-t">
            <h2 className="text-2xl font-heading font-bold mb-8">Benzer Ürünler</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    )
}
