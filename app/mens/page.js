import CollectionPage from '../../components/collection-page'
import { mensProducts } from '../../data/catalog'

export const metadata = {
  title: 'Mens Collection | Clothes Atelier'
}

export default function MensPage() {
  return (
    <CollectionPage
      title="Men's Collection"
      subtitle="Structured layers, confident tailoring, and everyday statement pieces."
      products={mensProducts}
      accent="ochre"
    />
  )
}