import Image from 'next/image'

// Details and photos come from the Zumper listing; the CTA links to Zillow.
const property = {
  name: 'Liberty Wells Bungalow',
  tagline: '2 bed · 2 bath house for rent',
  location: 'Central City–Liberty Wells, Salt Lake City',
  rent: '$2,495/month',
  availability: 'Available December 16, 2026',
  description: [
    'A classic brick-and-stucco bungalow in Central City–Liberty Wells, a few minutes from downtown Salt Lake City. Inside you’ll find hardwood floors, a living room built around a stone fireplace with built-in shelving, and a kitchen with granite counters.',
    'Out back is a fenced yard with a large deck and pergola. Solar panels, in-home laundry, and air conditioning keep it comfortable year-round, and the State St / Hampton Ave bus stop is just around the corner.',
  ],
  bookingUrl:
    'https://www.zillow.com/homedetails/151-E-Hampton-Ave-S-Salt-Lake-City-UT-84111/2071443884_zpid/',
  details: [
    { label: 'Bedrooms', value: '2' },
    { label: 'Baths', value: '2' },
    { label: 'Sq ft', value: '1,263' },
  ],
  amenities: [
    'Solar panels',
    'In-home washer & dryer',
    'Air conditioning',
    'Fenced backyard',
    'Deck with pergola',
    'Assigned parking',
  ],
  terms: [
    '12-month lease standard (12–24 months preferred)',
    '$2,500 security deposit',
    'Renters insurance required',
    'Pets considered case by case: $500 refundable deposit, $25/month per pet',
  ],
  photos: [
    {
      src: '/rental/photo-1.jpg',
      alt: 'Front of the bungalow with a covered brick porch',
    },
    {
      src: '/rental/photo-5.jpg',
      alt: 'Living room with a stone fireplace and built-in shelves',
    },
    {
      src: '/rental/photo-6.jpg',
      alt: 'Back deck with pergola and fenced yard',
    },
    { src: '/rental/photo-3.jpg', alt: 'Kitchen with granite counters' },
    { src: '/rental/photo-2.jpg', alt: 'Bedroom with a ceiling fan' },
    { src: '/rental/photo-4.jpg', alt: 'Bathroom with a tiled walk-in shower' },
  ],
}

export const metadata = {
  title: property.name,
  description: `${property.tagline} in ${property.location}. ${property.rent}.`,
}

function BookButton() {
  return (
    <a
      href={property.bookingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block px-6 py-3 bg-primary-color hover:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-lg transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
    >
      Schedule a Tour
    </a>
  )
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-6 shadow-sm">
      <h2 className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-500 mb-3">
        {title}
      </h2>
      <ul className="space-y-1">
        {items.map((item) => (
          <li
            key={item}
            className="text-sm text-slate-600 dark:text-slate-400 flex items-center"
          >
            <span className="w-1.5 h-1.5 bg-primary-color rounded-full mr-2 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Page() {
  const [heroPhoto, ...morePhotos] = property.photos

  return (
    <section>
      <h1 className="font-semibold text-3xl mb-2 tracking-tighter bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
        {property.name}
      </h1>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
        {property.location}
      </p>

      {heroPhoto && (
        <Image
          src={heroPhoto.src}
          alt={heroPhoto.alt}
          width={1280}
          height={960}
          className="w-full h-auto rounded-xl border border-slate-200 dark:border-slate-700 mb-8"
          priority
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50">
        <div>
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {property.rent}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {property.details
              .map(({ label, value }) => `${value} ${label.toLowerCase()}`)
              .join(' · ')}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
            {property.availability}
          </p>
        </div>
        <BookButton />
      </div>

      <div className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl space-y-4">
        {property.description.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-10">
        <ListCard title="Amenities" items={property.amenities} />
        <ListCard title="Lease Terms" items={property.terms} />
      </div>

      {morePhotos.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 mb-10">
          {morePhotos.map((photo) => (
            <Image
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              width={640}
              height={480}
              className="w-full aspect-[4/3] object-cover rounded-lg border border-slate-200 dark:border-slate-700"
            />
          ))}
        </div>
      )}

      <div className="text-center py-8 border-t border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-3">
          Interested?
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
          Tours are 30 minutes and booked in advance.
        </p>
        <BookButton />
      </div>
    </section>
  )
}
