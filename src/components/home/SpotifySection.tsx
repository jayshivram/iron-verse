import { motion } from 'framer-motion'
import { Music2 } from 'lucide-react'

const PLAYLISTS = [
  {
    title: 'My Fav',
    embedUrl:
      'https://open.spotify.com/embed/playlist/4FYepxrlOEaPT1t6x4R4Vb?si=40d2fba2b9834060',
  },
  {
    title: 'SadBoi Era',
    embedUrl:
      'https://open.spotify.com/embed/playlist/1pl65GxBYh9MbjPeg5NucI?si=97dbbabdce3649a6',
  },
  {
    title: 'Bolly',
    embedUrl:
      'https://open.spotify.com/embed/playlist/2IvaBracxkcaOmQWmskvYB?si=43687b7ca8994fa3',
  },
]

export function SpotifySection() {
  return (
    <section
      className="py-24 px-6 border-t border-ink-900 relative overflow-hidden"
      aria-labelledby="spotify-section-heading"
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-green-500/5 blur-3xl" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Music2 size={14} className="text-amber-500" />
            <p className="text-xs uppercase tracking-[0.3em] text-amber-500 font-sans">
              Listening to
            </p>
          </div>
          <h2
            id="spotify-section-heading"
            className="font-display text-[clamp(2rem,5vw,3.5rem)] text-ink-50 leading-none"
          >
            Soundtrack to the words
          </h2>
          <p className="mt-4 text-sm text-ink-500 font-sans max-w-sm mx-auto leading-relaxed">
            The playlists that play while the poems get written.
          </p>
        </motion.div>

        {/* Playlist cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLAYLISTS.map((playlist, i) => (
            <motion.div
              key={playlist.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: '0 4px 32px rgba(0,0,0,0.4)',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = 'rgba(29,185,84,0.25)'
                el.style.boxShadow =
                  '0 4px 40px rgba(29,185,84,0.12), 0 0 0 1px rgba(29,185,84,0.15)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement
                el.style.borderColor = 'rgba(255,255,255,0.07)'
                el.style.boxShadow = '0 4px 32px rgba(0,0,0,0.4)'
              }}
            >
              {/* Playlist label */}
              <div
                className="px-5 pt-4 pb-3 flex items-center gap-2"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                {/* Spotify logo mark */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="#1DB954"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                </svg>
                <span className="text-sm font-sans font-medium text-ink-200">
                  {playlist.title}
                </span>
              </div>

              {/* Spotify embed */}
              <iframe
                src={`${playlist.embedUrl}&theme=0`}
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title={`${playlist.title} playlist`}
                style={{ display: 'block' }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
