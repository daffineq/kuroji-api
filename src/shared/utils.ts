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