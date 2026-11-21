import Image from 'next/image'

// TODO: replace these placeholders with the real property details.
// Photos go in public/stay/ and are referenced as '/stay/<file>'.
const property = {
  name: 'Your Property Name',
  tagline: 'A short one-line pitch for the place',
  location: 'City, Utah',
  description: [
    'Describe the space: what it feels like, who it is great for, and what makes it different from a hotel.',
    'Mention what is nearby—trailheads, ski resorts, downtown, restaurants—and roughly how far away they are.',
  ],
  bookingUrl: 'https://example.com/book',
  details: [
    { label: 'Guests', value: '4' },
    { label: 'Bedrooms', value: '2' },
    { label: 'Beds', value: '2' },
    { label: 'Baths', value: '1' },
  ],
  amenities: [
    'Wi-Fi',
    'Full kitchen',
    'Free parking',
    'Washer & dryer',
    'Self check-in',
  ],
  photos: [] as { src: string; alt: string }[],
}

export const metadata = {
  title: property.name,
  description: `${property.tagline} in ${property.location}. Book your stay directly.`,
}

function BookButton() {
  return (
    <a
      href={property.bookingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block px-6 py-3 bg-primary-color hover:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-lg transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
    >
      Book Direct
    </a>
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
          width={1200}
          height={800}
          className="w-full h-auto rounded-xl border border-slate-200 dark:border-slate-700 mb-8"
          priority
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50">
        <div>
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {property.tagline}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {property.details
              .map(({ label, value }) => `${value} ${label.toLowerCase()}`)
              .join(' · ')}
          </p>
        </div>
        <BookButton />
      </div>

      <div className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl space-y-4">
        {property.description.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-6 shadow-sm mb-10">
        <h2 className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-500 mb-3">
          Amenities
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-1">
          {property.amenities.map((amenity) => (
            <li
              key={amenity}
              className="text-sm text-slate-600 dark:text-slate-400 flex items-center"
            >
              <span className="w-1.5 h-1.5 bg-primary-color rounded-full mr-2 flex-shrink-0" />
              {amenity}
            </li>
          ))}
        </ul>
      </div>

      {morePhotos.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 mb-10">
          {morePhotos.map((photo) => (
            <Image
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              width={600}
              height={400}
              className="w-full h-auto rounded-lg border border-slate-200 dark:border-slate-700"
            />
          ))}
        </div>
      )}

      <div className="text-center py-8 border-t border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-3">
          Ready to stay?
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
          Book directly with me for the best rate—no platform fees.
        </p>
        <BookButton />
      </div>
    </section>
  )
}
