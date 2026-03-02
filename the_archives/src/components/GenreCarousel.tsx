import '../styles/buttons.css'

export default function GenreCarousel(props: {genres: string[]}) {
  const genres = Array.isArray(props.genres) ? props.genres : []

  return (
    <div className="genre-container">
      {genres.map((genre, index) => (
        <div className="genre-pill" key={index}>{genre}</div>
      ))}
    </div>
  )
}

