export interface Hero {
  id: number;
  name: string;
  realName: string;
  alias: string;
  alignment: string;
  team: string;
  powers: string[];
  origin: string;
  firstAppearance: string;
  imageUrl: string;
}
export interface HeroesPaginated {
  data: Hero[];
  totalHeroes: number;
}
