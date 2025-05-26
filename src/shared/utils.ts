import { PageInfo } from '../api/ApiResponse'

export function getPageInfo(total: number, perPage: number, page: number): PageInfo {
  const lastPage = Math.ceil(total / perPage)
  return {
    total,
    perPage,
    currentPage: page,
    lastPage,
    hasNextPage: page < lastPage,
  }
}

export function sleep(duration: number): Promise<void> {
  console.log(`Sleeping for ${duration} seconds...`)
  return new Promise((resolve) => setTimeout(resolve, duration * 1000))
}

export function firstUpper(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function firstUpperList(arr: string[]): string[] {
  return arr.map(firstUpper)
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3
): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (err: any) {
      const status = err?.response?.status || err?.status

      if (status === 429) {
        const retryAfter =
          parseInt(err?.response?.headers?.['retry-after']) || 10

        console.warn(`⏳ Rate limited, waiting ${retryAfter}s... [Attempt ${attempt + 1}/${retries}]`)
        await sleep(retryAfter)
      } else {
        await sleep(5)
      }
    }
  }

  throw new Error(`💥 Failed after ${retries + 1} attempts`)
}
