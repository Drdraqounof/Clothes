import CollectionPage from '../../components/collection-page'
import { womensProducts } from '../../data/catalog'

export const metadata = {
  title: 'Womens Collection | Clothes Atelier'
}

export default function WomensPage() {
  return (
    <CollectionPage
      title="Women's Collection"
      subtitle="Fluid silhouettes, modern romance, and sharp essentials with presence."
      products={womensProducts}
      accent="sand"
    />
  )
}