
const z = require('zod')

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Move title must be a string',
    required_error: 'Movie title is rquired'
  }),
  year: z.number().int().min(1900).max(2024),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(5),
  poster: z.string().url({
    message: 'Poster must be a valid URL'
  }),
  genre: z.array(
    z.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Crime']),
    {
      required_error: 'Movie genre is required.',
      invalid_type_error: 'Movie genre must be an array of enum Genre'
    }
  )
})

function validateMovie(object) {
  return movieSchema.safeParse(object) // retorna un objeto que muestra si hay error o hay datos
  // return movieSchema.parse(object)
}
function validatePartialMovie(object) {
  return movieSchema.partial().safeParse(object) // retorna un objeto que muestra si hay error o hay datos
  // return movieSchema.parse(object)
}

module.exports = {
  validateMovie,
  validatePartialMovie
}