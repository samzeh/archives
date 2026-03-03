import { infiniteQueryOptions, useQuery } from '@tanstack/react-query'

const fetchBookCover = async(title: string, author: string): Promise<string> => {
  const baseUrl = 'https://bookcover.longitood.com'

  title = (title ?? '').trim().replace(/\s+/g, '&').toLowerCase()
  author = (author ?? '').trim().replace(/\s+/g, '&').toLowerCase()

  const queryParams = new URLSearchParams({
    book_title: title,
    author_name: author,
  })

  const fullUrl = new URL(baseUrl);
  fullUrl.search = queryParams.toString()

  const response = await fetch(fullUrl)

  if (!response.ok) {
    throw new Error(`Failed to fetch book cover: ${response.statusText}`)
  }

  const data = await response.json()
  return data.url
}


export function useBookCover(title: string, author: string) {
  const key = `${title}-${author}`
  return useQuery({
    queryKey: ["bookCover", key],
    queryFn: () =>fetchBookCover(title, author),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: Infinity
  })
}