interface EngagementDetails {
  [propName: string]: {
    engagement_type: string
    ui_additional_detail?: string
  }
}

const profileEvents = {
  // follow button
  'profile.follow.unblock': {
    engagement_type: 'general',
  },
  'profile.follow.unmute': {
    engagement_type: 'general',
  },
  'profile.follow.unfollow': {
    engagement_type: 'general',
  },
  'profile.follow.follow': {
    engagement_type: 'general',
  },
  'profile.follow.withdraw-follow-request': {
    engagement_type: 'general',
  },
  'profile.follow.follow-request': {
    engagement_type: 'general',
  },
  // more button
  'profile.more.open': {
    engagement_type: 'general',
  },
  'profile.more.open_in_original_site': {
    engagement_type: 'general',
  },
  'profile.more.share_account': {
    engagement_type: 'general',
  },
  'profile.more.mention': {
    engagement_type: 'general',
  },
  'profile.more.direct_message': {
    engagement_type: 'general',
  },
  'profile.more.show_boosts': {
    engagement_type: 'general',
  },
  'profile.more.hide_boosts': {
    engagement_type: 'general',
  },
  'profile.more.add_note': {
    engagement_type: 'general',
  },
  'profile.more.remove_note': {
    engagement_type: 'general',
  },
  'profile.more.mute': {
    engagement_type: 'general',
  },
  'profile.more.unmute': {
    engagement_type: 'general',
  },
  'profile.more.block': {
    engagement_type: 'general',
  },
  'profile.more.unblock': {
    engagement_type: 'general',
  },
  'profile.more.block_domain': {
    engagement_type: 'general',
  },
  'profile.more.unblock_domain': {
    engagement_type: 'general',
  },
  'profile.more.report': {
    engagement_type: 'general',
  },
  'profile.more.goto_pinned': {
    engagement_type: 'general',
  },
  'profile.more.goto_favorites': {
    engagement_type: 'general',
  },
  'profile.more.goto_mutes': {
    engagement_type: 'general',
  },
  'profile.more.goto_blocks': {
    engagement_type: 'general',
  },
  'profile.more.goto_domain_blocks': {
    engagement_type: 'general',
  },
  // notifications
  'profile.notify_start': {
    engagement_type: 'general',
  },
  'profile.notify_stop': {
    engagement_type: 'general',
  },
  // modify lists
  'profile.modify_lists': {
    engagement_type: 'general',
  },
  // details
  'profile.details.posts': {
    engagement_type: 'general',
  },
  'profile.details.following': {
    engagement_type: 'general',
  },
  'profile.details.followers': {
    engagement_type: 'general',
  },
  // tabs
  'profile.tabs.posts': {
    engagement_type: 'general',
  },
  'profile.tabs.posts_and_replies': {
    engagement_type: 'general',
  },
  'profile.tabs.media': {
    engagement_type: 'general',
  },
}

export const engagementDetails: EngagementDetails = {
  'settings.interface.colorMode': {
    engagement_type: 'general',
  },
  'settings.interface.fontSize': {
    engagement_type: 'general',
  },
  'settings.interface.themeColor': {
    engagement_type: 'general',
  },
  ...profileEvents,
}
