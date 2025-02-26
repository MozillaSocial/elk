<script setup lang="ts">
// @ts-expect-error missing types
import { DynamicScrollerItem } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import type { Paginator, WsEvents, mastodon } from 'masto'
import { ref } from 'vue'

const { paginator, stream, account, buffer = 10, endMessage = true } = defineProps<{
  paginator: Paginator<mastodon.v1.Status[], mastodon.v1.ListAccountStatusesParams>
  stream?: Promise<WsEvents>
  context?: mastodon.v2.FilterContext
  account?: mastodon.v1.Account
  preprocess?: (items: mastodon.v1.Status[]) => mastodon.v1.Status[]
  buffer?: number
  endMessage?: boolean | string
  feedName?: string
}>()

const commonPaginator = ref(null)

function percolateStatus(status) {
  commonPaginator.value.percolateStatus(status)
}

defineExpose({
  percolateStatus,
})

const { formatNumber } = useHumanReadableNumber()
const virtualScroller = $(usePreferences('experimentalVirtualScroller'))

const showOriginSite = $computed(() =>
  account && account.id !== currentUser.value?.account.id && getServerName(account) !== currentServer.value,
)
</script>

<template>
  <CommonPaginator ref="commonPaginator" v-bind="{ paginator, stream, preprocess, buffer, endMessage }" :virtual-scroller="virtualScroller">
    <template #updater="{ number, update }">
      <button py-4 border="b base" flex="~ col" p-3 w-full text-primary font-bold @click="update">
        {{ $t('timeline.show_new_items', number, { named: { v: formatNumber(number) } }) }}
      </button>
    </template>
    <template #default="{ item, older, newer, active }">
      <template v-if="virtualScroller">
        <DynamicScrollerItem :item="item" :active="active" tag="article">
          <StatusCard :status="item" :context="context" :older="older" :newer="newer" :feed-name="feedName" />
        </DynamicScrollerItem>
      </template>
      <template v-else>
        <StatusCard :status="item" :context="context" :older="older" :newer="newer" :feed-name="feedName" />
      </template>
    </template>
    <template v-if="context === 'account' " #done="{ items }">
      <div
        v-if="showOriginSite || items.length === 0"
        p5 text-secondary text-center flex flex-col items-center gap1
      >
        <template v-if="showOriginSite">
          <span italic>{{ $t('timeline.view_older_posts') }}</span>
          <NuxtLink
            :href="account!.url" target="_blank" external
            flex="~ gap-1" items-center text-primary
            hover="underline text-primary-active"
          >
            <div i-ri:external-link-fill />
            {{ $t('menu.open_in_original_site') }}
          </NuxtLink>
        </template>
        <span v-else-if="items.length === 0">No posts here!</span>
      </div>
    </template>
  </CommonPaginator>
</template>
