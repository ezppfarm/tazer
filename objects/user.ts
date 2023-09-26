import { DBUser } from "../types/DBUser";

export class User {

  avatar_url: string;
  country_code: string;
  default_group = "default";
  id: number;
  username: string;
  profile_colour = null;
  pm_friends_only = false;
  is_active = true;
  is_online = true;
  is_bot = false;
  is_deleted = false;
  cover_url = "https://osu.ppy.sh/images/headers/profile-covers/c5.jpg"
  discord = null;
  has_supported = false;
  interests = null;
  kudosu = {
    total: 0,
    available: 0
  }
  location = null;
  max_blocks = 50;
  max_friends = 250;
  occupation = null;
  playmode = "osu";
  playstyle = null;
  post_count = 0;
  profile_order = [
    "me",
    "recent_activity",
    "top_ranks",
    "medals",
    "historical",
    "beatmaps",
    "kudosu"
  ];
  title = null;
  title_url = null;
  twitter = null;
  website = null;
  is_admin = false;
  is_bng = false;
  is_gmt = false;
  is_limited_bn = false;
  is_moderator = false;
  is_nat = false;
  is_silenced = false;
  constructor(dbResult: DBUser) {
    this.id = dbResult.id;
    this.username = dbResult.name;
    this.country_code = dbResult.country
  }
}