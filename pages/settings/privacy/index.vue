<script setup lang="ts">
import type GleanType from '@mozilla/glean/web'
import { mastodonAccountHandle, mastodonAccountId } from '~/telemetry/generated/identifiers'
import { userAgent } from '~~/telemetry/generated/identifiers'

let Glean: typeof GleanType
if (typeof window !== 'undefined') {
  const importedModule = await import('@mozilla/glean/web')
  Glean = importedModule.default
}

const user = currentUser.value

const { t } = useI18n()

useHydratedHead({
  title: () => `${t('settings.privacy.label')} | ${t('nav.settings')}`,
})
const userSettings = useUserSettings()

function toggleOptOut() {
  if (Glean) {
    const allowGlean = togglePreferences('allowGlean')

    Glean.setUploadEnabled(allowGlean)

    // reset identifiers if user opts back in
    if (user && allowGlean) {
      mastodonAccountHandle.set(user.account.acct)
      mastodonAccountId.set(user.account.id)
      userAgent.set(navigator.userAgent)
    }
  }
}
</script>

<template>
  <MainContent back-on-small-screen no-beta-label>
    <template #title>
      <div text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
        <span>{{ $t('settings.privacy.label') }}</span>
      </div>
    </template>
    <div p6 flex="~ col gap6">
      <h2 text-xl>
        {{ $t('settings.privacy.data_collection') }}
      </h2>
      <div>
        <h3 text-lg>
          {{ $t('settings.privacy.opt_out_title') }}
        </h3>
        <client-only>
          <SettingsToggleItem
            :checked="getPreferences(userSettings, 'allowGlean')"
            @click="toggleOptOut()"
          >
            {{ $t('settings.privacy.opt_out_description') }}
          </SettingsToggleItem>
        </client-only>
      </div>
    </div>
  </MainContent>
</template>
