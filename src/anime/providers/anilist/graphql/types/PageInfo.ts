export class PageInfo {
  constructor(
    public total?: number,
    public perPage?: number,
    public currentPage?: number,
    public lastPage?: number,
    public hasNextPage?: boolean,
  ) {}
}
