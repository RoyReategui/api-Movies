const express = require('express')
const movies = require('./movies.json')
const crypto = require('node:crypto')
const movieSchema = require('./schemas/movies')
const cors = require('cors')

const app = express()
app.disable('x-powered-by')
app.use(express.json())
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTD_ORIGINS = [
      'http://localhost:8080',
      'https://movies.com',
      'https://modu.dev'
    ]
    if (ACCEPTD_ORIGINS.includes(origin)) {
      return callback(null, true)
    }
    if (!origin) {
      return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'))
  }
}))





app.get('/movies', (req, res) => {
  const { genre } = req.query
  if (genre) {
    return res.json(movies.filter(movie => movie.genre.some(gen => gen.toLocaleLowerCase() === genre.toLocaleLowerCase())))
  }
  res.json(movies)
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) {
    res.json(movie)
  } else {
    res.status(500)
    res.json(
      { erorr: `movies with id = ${id} not found` }
    )
  }
})

app.post('/movies', (req, res) => {
  const result = movieSchema.validateMovie(req.body)
  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }
  movies.push(newMovie)
  res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
  const { id } = req.params

  const result = movieSchema.validatePartialMovie(req.body)
  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const indexMovie = movies.findIndex(movie => movie.id === id)
  if (indexMovie === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  const updateMovie = {
    ...movies[indexMovie],
    ...result.data,
  }
  movies[indexMovie] = updateMovie
  return res.json(updateMovie)

})


app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const index = movies.findIndex(movie => movie.id === id)
  if (index === -1) {
    return res.status(404).json({ error: 'Recurso no encontrado' })
  }
  movies.splice(index, 1)
  return res.json({ message: 'Movie delete' })

})

const PORT = process.env.PORT ?? 1234
app.listen(PORT, () => {
  console.log(`Server runing in http://localhost:${PORT} `);
})

