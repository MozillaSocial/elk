<script setup lang="ts">
import type { mastodon } from 'masto'
import { engagement } from '~~/telemetry/generated/ui'
import { engagementDetails } from '~~/telemetry/engagementDetails'
import { toggleFollowAccount, useRelationship } from '~~/composables/masto/relationship'

const { account, command, context, gleanContext, ...props } = defineProps<{
  account: mastodon.v1.Account
  relationship?: mastodon.v1.Relationship
  gleanContext?: string
  context?: 'followedBy' | 'following'
  command?: boolean
}>()

const { t } = useI18n()
const isSelf = $(useSelfAccount(() => account))
const enable = $computed(() => !isSelf && currentUser.value)
const relationship = $computed(() => props.relationship || useRelationship(account).value)

const { client } = $(useMasto())

async function unblock() {
  relationship!.blocking = false
  try {
    const newRel = await client.v1.accounts.unblock(account.id)
    Object.assign(relationship!, newRel)
  }
  catch (err) {
    console.error(err)
    // TODO error handling
    relationship!.blocking = true
  }
}

async function unmute() {
  relationship!.muting = false
  try {
    const newRel = await client.v1.accounts.unmute(account.id)
    Object.assign(relationship!, newRel)
  }
  catch (err) {
    console.error(err)
    // TODO error handling
    relationship!.muting = true
  }
}

useCommand({
  scope: 'Actions',
  order: -2,
  visible: () => command && enable,
  name: () => `${relationship?.following ? t('account.unfollow') : t('account.follow')} ${getShortHandle(account)}`,
  icon: 'i-ri:star-line',
  onActivate: () => toggleFollowAccount(relationship!, account),
})

const buttonStyle = $computed(() => {
  if (relationship?.blocking)
    return 'text-inverted bg-red border-red'

  if (relationship?.muting)
    return 'text-base bg-card border-base'

  // If following, use a label style with a strong border for Mutuals
  if (relationship ? relationship.following : context === 'following')
    return `text-base ${relationship?.followedBy ? 'border-strong' : 'border-base'}`

  // If not following, use a button style
  return 'text-inverted bg-primary border-primary'
})

const dataGlean = $computed(() => {
  if (!gleanContext)
    return undefined

  let action
  if (relationship?.blocking)
    action = 'follow-btn.unblock'
  else if (relationship?.muting)
    action = 'follow-btn.unmute'
  else if (relationship ? relationship.following : context === 'following')
    action = 'follow-btn.unfollow'
  else if (relationship?.requested)
    action = 'follow-btn.withdraw-follow-request'
  else if ((relationship ? relationship.followedBy : context === 'followedBy') && account.locked)
    action = 'follow-btn.follow-request'
  else
    action = 'follow-btn.follow'

  return `${gleanContext}.${action}`
})

function handleClick() {
  function recordEngagement() {
    engagement.record({
      ui_identifier: dataGlean,
      mastodon_account_id: account.id,
      mastodon_account_handle: account.acct,
      ...engagementDetails[dataGlean],
    })
  }

  const unfollow = relationship?.following || relationship?.requested

  // Make sure recordEngagement is called before making changes to account/relationship
  if (relationship?.blocking) {
    recordEngagement()
    unblock()
  }
  else if (relationship?.muting) {
    recordEngagement()
    unmute()
  }
  else if (unfollow) {
    toggleFollowAccount(relationship!, account, dataGlean)
  }
  else {
    recordEngagement()
    toggleFollowAccount(relationship!, account)
  }
}
</script>

<template>
  <button
    v-if="enable"
    gap-1 items-center group
    border-1
    rounded-full flex="~ gap2 center" font-500 min-w-30 h-fit px3 py1
    :class="buttonStyle"
    :hover="!relationship?.blocking && !relationship?.muting && relationship?.following ? 'border-red text-red' : 'bg-base border-primary text-primary'"
    @click="handleClick"
  >
    <template v-if="relationship?.blocking">
      <span elk-group-hover="hidden">{{ $t('account.blocking') }}</span>
      <span hidden elk-group-hover="inline">{{ $t('account.unblock') }}</span>
    </template>
    <template v-if="relationship?.muting">
      <span elk-group-hover="hidden">{{ $t('account.muting') }}</span>
      <span hidden elk-group-hover="inline">{{ $t('account.unmute') }}</span>
    </template>
    <template v-else-if="relationship ? relationship.following : context === 'following'">
      <span elk-group-hover="hidden">{{ relationship?.followedBy ? $t('account.mutuals') : $t('account.following') }}</span>
      <span hidden elk-group-hover="inline">{{ $t('account.unfollow') }}</span>
    </template>
    <template v-else-if="relationship?.requested">
      <span elk-group-hover="hidden">{{ $t('account.follow_requested') }}</span>
      <span hidden elk-group-hover="inline">Withdraw follow request</span>
    </template>
    <template v-else-if="relationship ? relationship.followedBy : context === 'followedBy'">
      <span elk-group-hover="hidden">{{ $t('account.follows_you') }}</span>
      <span hidden elk-group-hover="inline">{{ account.locked ? $t('account.request_follow') : $t('account.follow_back') }}</span>
    </template>
    <template v-else>
      <span>{{ account.locked ? $t('account.request_follow') : $t('account.follow') }}</span>
    </template>
  </button>
</template>
