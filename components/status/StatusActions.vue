<script setup lang="ts">
import type { mastodon } from 'masto'
import { engagement } from '~~/telemetry/generated/ui'
import { engagementDetails } from '~~/telemetry/engagementDetails'

const props = defineProps<{
  status: mastodon.v1.Status
  feedName?: string
  details?: boolean
  command?: boolean
}>()

const focusEditor = inject<typeof noop>('focus-editor', noop)

const { details, command, feedName } = $(props)

const userSettings = useUserSettings()
const useStarFavoriteIcon = usePreferences('useStarFavoriteIcon')

const {
  status,
  isLoading,
  canReblog,
  toggleBookmark,
  toggleFavourite,
  toggleReblog,
} = $(useStatusActions(props))

function recordEngagement(engagementAction: string) {
  const analyticsId = feedName ? `${feedName}.post.${engagementAction}` : `post.${engagementAction}`
  engagement.record({ ui_identifier: analyticsId, mastodon_status_id: status.id, ...engagementDetails[analyticsId] })
}

function reply() {
  recordEngagement('open-reply')

  if (!checkLogin())
    return
  if (details)
    focusEditor()
  else
    navigateToStatus({ status, focusReply: true })
}

function reblog() {
  toggleReblog()
  recordEngagement(status.reblogged ? 'reblog' : 'unreblog')
}

function favourite() {
  toggleFavourite()
  recordEngagement(status.favourited ? 'favourite' : 'unfavourite')
}

function bookmark() {
  toggleBookmark()
  recordEngagement(status.bookmarked ? 'bookmark' : 'unbookmark')
}
</script>

<template>
  <div flex justify-between items-center class="status-actions">
    <div flex-1>
      <StatusActionButton
        :content="$t('action.reply')"
        :text="!getPreferences(userSettings, 'hideReplyCount') && status.repliesCount || ''"
        color="text-blue" hover="text-blue" elk-group-hover="bg-blue/10"
        icon="i-ri:chat-1-line"
        :command="command"
        @click="reply"
      >
        <template v-if="status.repliesCount && !getPreferences(userSettings, 'hideReplyCount')" #text>
          <CommonLocalizedNumber
            keypath="action.reply_count"
            :count="status.repliesCount"
          />
        </template>
      </StatusActionButton>
    </div>

    <div flex-1>
      <StatusActionButton
        :content="$t('action.boost')"
        :text="!getPreferences(userSettings, 'hideBoostCount') && status.reblogsCount ? status.reblogsCount : ''"
        color="text-green" hover="text-green" elk-group-hover="bg-green/10"
        icon="i-ri:repeat-line"
        active-icon="i-ri:repeat-fill"
        :active="!!status.reblogged"
        :disabled="isLoading.reblogged || !canReblog"
        :command="command"
        @click="reblog"
      >
        <template v-if="status.reblogsCount && !getPreferences(userSettings, 'hideBoostCount')" #text>
          <CommonLocalizedNumber
            keypath="action.boost_count"
            :count="status.reblogsCount"
          />
        </template>
      </StatusActionButton>
    </div>

    <div flex-1>
      <StatusActionButton
        :content="$t('action.favourite')"
        :text="!getPreferences(userSettings, 'hideFavoriteCount') && status.favouritesCount ? status.favouritesCount : ''"
        :color="useStarFavoriteIcon ? 'text-yellow' : 'text-rose'"
        :hover="useStarFavoriteIcon ? 'text-yellow' : 'text-rose'"
        :elk-group-hover="useStarFavoriteIcon ? 'bg-yellow/10' : 'bg-rose/10'"
        :icon="useStarFavoriteIcon ? 'i-ri:star-line' : 'i-ri:heart-3-line'"
        :active-icon="useStarFavoriteIcon ? 'i-ri:star-fill' : 'i-ri:heart-3-fill'"
        :active="!!status.favourited"
        :disabled="isLoading.favourited"
        :command="command"
        @click="favourite"
      >
        <template v-if="status.favouritesCount && !getPreferences(userSettings, 'hideFavoriteCount')" #text>
          <CommonLocalizedNumber
            keypath="action.favourite_count"
            :count="status.favouritesCount"
          />
        </template>
      </StatusActionButton>
    </div>

    <div flex-none>
      <StatusActionButton
        :content="$t('action.bookmark')"
        :color="useStarFavoriteIcon ? 'text-rose' : 'text-yellow'"
        :hover="useStarFavoriteIcon ? 'text-rose' : 'text-yellow'"
        :elk-group-hover="useStarFavoriteIcon ? 'bg-rose/10' : 'bg-yellow/10' "
        icon="i-ri:bookmark-line"
        active-icon="i-ri:bookmark-fill"
        :active="!!status.bookmarked"
        :disabled="isLoading.bookmarked"
        :command="command"
        @click="bookmark"
      />
    </div>
  </div>
</template>
