import { DBUser } from "../types/DBUser";
import { getCountryNameFromCode } from "../utils/countryUtils";

export class User {
  avatar_url: string;
  country_code: string;
  default_group = "default";
  id: number;
  is_active = true;
  is_bot = false;
  is_deleted = false;
  is_online = false;
  is_supporter = false;
  last_visit = null;
  pm_friends_only = false;
  profile_colour = null;
  username: string;
  cover_url = "https://osu.ppy.sh/images/headers/profile-covers/c2.jpg";
  discord: string;
  has_supported = false;
  interests = null;
  join_date: string;
  location: string;
  max_blocks = 100;
  max_friends = 500;
  occupation = null;
  playmode = "osu";
  playstyle = [
    "keyboard",
    "mouse",
    "tablet"
  ];
  post_count = 0;
  profile_order: [
    "me",
    "top_ranks",
    "medals",
    "historical",
    "beatmaps",
    "kudosu",
    "recent_activity"
  ];
  title = null;
  title_url = null;
  twitter = null;
  website = null;
  country: {
    code: string;
    name: string;
  };
  cover: {
    custom_url: "https://osu.ppy.sh/images/headers/profile-covers/c2.jpg",
    url: "https://osu.ppy.sh/images/headers/profile-covers/c2.jpg",
    id: null
  };
  is_restricted = false;
  kudosu: {
    available: 0,
    total: 0
  };
  account_history: [];
  active_tournament_banner: null;
  badges: [];
  beatmap_playcounts_count = 0;
  comments_count = 0;
  favourite_beatmapset_count = 0;
  follower_count = 0;
  graveyard_beatmapset_count = 0;
  groups: [];
  guest_beatmapset_count: 0;
  loved_beatmapset_count: 0;
  mapping_follower_count: 0;
  monthly_playcounts: [];
  nominated_beatmapset_count: 0;
  page: {
    html: "",
    raw: ""
  };
  pending_beatmapset_count: 0;
  previous_usernames = [];
  rank_highest = {
    rank: 0,
    updated_at: null
  };
  ranked_beatmapset_count = 0;
  replays_watched_counts = [];
  scores_best_count: 0;
  scores_first_count: 0;
  scores_pinned_count: 0;
  scores_recent_count: 0;
  statistics: {
    count_100: 0,
    count_300: 0,
    count_50: 0,
    count_miss: 0,
    level: {
      current: 0,
      progress: 0
    },
    global_rank: null,
    global_rank_exp: null,
    pp: 0,
    pp_exp: 0,
    ranked_score: 0,
    hit_accuracy: 0.00,
    play_count: 0,
    play_time: 0,
    total_score: 0,
    total_hits: 0,
    maximum_combo: 0,
    replays_watched_by_others: 0,
    is_ranked: false,
    grade_counts: {
      ss: 0,
      ssh: 0,
      s: 0,
      sh: 0,
      a: 0
    },
    country_rank: null,
    rank: {
      country: null
    }
  }
  statistics_rulesets: {
    osu: {
      count_100: 0,
      count_300: 0,
      count_50: 0,
      count_miss: 0,
      level: {
        current: 0,
        progress: 0
      },
      global_rank: null,
      global_rank_exp: null,
      pp: 0,
      pp_exp: 0,
      ranked_score: 0,
      hit_accuracy: 0.00,
      play_count: 0,
      play_time: 0,
      total_score: 0,
      total_hits: 0,
      maximum_combo: 0,
      replays_watched_by_others: 0,
      is_ranked: false,
      grade_counts: {
        ss: 0,
        ssh: 0,
        s: 0,
        sh: 0,
        a: 0
      }
    },
    taiko: {
      count_100: 0,
      count_300: 0,
      count_50: 0,
      count_miss: 0,
      level: {
        current: 0,
        progress: 0
      },
      global_rank: null,
      global_rank_exp: null,
      pp: 0,
      pp_exp: 0,
      ranked_score: 0,
      hit_accuracy: 0.00,
      play_count: 0,
      play_time: 0,
      total_score: 0,
      total_hits: 0,
      maximum_combo: 0,
      replays_watched_by_others: 0,
      is_ranked: false,
      grade_counts: {
        ss: 0,
        ssh: 0,
        s: 0,
        sh: 0,
        a: 0
      }
    },
    fruits: {
      count_100: 0,
      count_300: 0,
      count_50: 0,
      count_miss: 0,
      level: {
        current: 0,
        progress: 0
      },
      global_rank: null,
      global_rank_exp: null,
      pp: 0,
      pp_exp: 0,
      ranked_score: 0,
      hit_accuracy: 0.00,
      play_count: 0,
      play_time: 0,
      total_score: 0,
      total_hits: 0,
      maximum_combo: 0,
      replays_watched_by_others: 0,
      is_ranked: false,
      grade_counts: {
        ss: 0,
        ssh: 0,
        s: 0,
        sh: 0,
        a: 0
      }
    },
    mania: {
      count_100: 0,
      count_300: 0,
      count_50: 0,
      count_miss: 0,
      level: {
        current: 0,
        progress: 0
      },
      global_rank: null,
      global_rank_exp: null,
      pp: 0,
      pp_exp: 0,
      ranked_score: 0,
      hit_accuracy: 0.00,
      play_count: 0,
      play_time: 0,
      total_score: 0,
      total_hits: 0,
      maximum_combo: 0,
      replays_watched_by_others: 0,
      is_ranked: false,
      grade_counts: {
        ss: 0,
        ssh: 0,
        s: 0,
        sh: 0,
        a: 0
      }
    }
  };
  support_level = 0;
  user_achievements = [];
  rankHistory: {
    mode: "osu",
    data: null
  };
  rank_history: {
    mode: "osu",
    data: null
  }
  ranked_and_approved_beatmapset_count = 0;
  unranked_beatmapset_count = 0;
  constructor(dbResult: DBUser) {
    this.id = dbResult.id;
    this.username = dbResult.name;
    this.avatar_url = `https://avatar.ez-pp.farm/${this.id}`;
    this.join_date = dbResult.join_time.toISOString();
    this.country_code = dbResult.country;
    this.country = {
      code: dbResult.country,
      name: getCountryNameFromCode(dbResult.country)
    }
  }
}