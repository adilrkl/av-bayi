import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { serializeProduct } from "@/lib/utils"
import { ProductGallery } from "@/components/product/product-gallery"
import { ProductInfo } from "@/components/product/product-info"
import { RelatedProducts } from "@/components/product/related-products"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { YouTubeEmbed } from "@/components/ui/youtube-embed"

interface ProductPageProps {
    params: Promise<{
        slug: string
    }>
}

export default async function ProductPage(props: ProductPageProps) {
    const params = await props.params
    const product = await prisma.product.findUnique({
        where: {
            slug: params.slug
        },
        include: {
            category: true,
            brand: true
        }
    })

    if (!product) {
        notFound()
    }

    // Fetch related products
    const relatedProducts = await prisma.product.findMany({
        where: {
            categoryId: product.categoryId,
            id: { not: product.id }
        },
        take: 4,
        include: {
            category: true
        }
    })

    const serializedProduct = serializeProduct(product)
    const serializedRelatedProducts = relatedProducts.map(serializeProduct)

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="text-sm text-muted-foreground mb-6">
                Anasayfa / {product.category.name} / {product.name}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
                {/* Gallery */}
                <ProductGallery images={product.images} />

                {/* Info */}
                <ProductInfo product={serializedProduct} />
            </div>



            {/* Tabs: Description, Specs, Reviews, Video */}
            <div className="mb-16">
                <Tabs defaultValue="description">
                    <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent flex-wrap">
                        <TabsTrigger
                            value="description"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-8 py-3 font-bold text-lg"
                        >
                            Açıklama
                        </TabsTrigger>
                        <TabsTrigger
                            value="specs"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-8 py-3 font-bold text-lg"
                        >
                            Özellikler
                        </TabsTrigger>
                        {product.youtubeUrl && (
                            <TabsTrigger
                                value="video"
                                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-8 py-3 font-bold text-lg"
                            >
                                Video
                            </TabsTrigger>
                        )}
                    </TabsList>
                    <TabsContent value="description" className="pt-6">
                        <div
                            className="prose max-w-none text-muted-foreground"
                            dangerouslySetInnerHTML={{ __html: product.description }}
                        />
                    </TabsContent>
                    <TabsContent value="specs" className="pt-6">
                        <div className="text-muted-foreground">
                            {product.features ? (
                                <div
                                    className="prose max-w-none"
                                    dangerouslySetInnerHTML={{ __html: product.features }}
                                />
                            ) : (
                                <p>Teknik özellikler yakında eklenecek.</p>
                            )}
                        </div>
                    </TabsContent>
                    {product.youtubeUrl && (
                        <TabsContent value="video" className="pt-6">
                            <div className="max-w-4xl mx-auto">
                                <YouTubeEmbed url={product.youtubeUrl} />
                            </div>
                        </TabsContent>
                    )}
                </Tabs>
            </div>

            {/* Related Products */}
            <RelatedProducts products={serializedRelatedProducts} />
        </div>
    )
}
