import { NativeTabs } from 'expo-router/native-tabs';

import { useTheme } from '@/hooks/use-theme';
import { haptics } from '@/lib/haptics';
import { useMarketplace } from '@/store/marketplace';

export default function AppTabs() {
  const theme = useTheme();
  const { sales } = useMarketplace();
  const needsAction = sales.filter((s) => s.stage === 'paid').length;

  return (
    <NativeTabs
      tintColor={theme.tintText}
      minimizeBehavior="onScrollDown"
      screenListeners={{ tabPress: haptics.select }}>
      <NativeTabs.Trigger name="(shop)">
        <NativeTabs.Trigger.Label>Shop</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'bag', selected: 'bag.fill' }} md="storefront" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="sell">
        <NativeTabs.Trigger.Label>Sell</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'tag', selected: 'tag.fill' }} md="sell" />
        {needsAction > 0 && <NativeTabs.Trigger.Badge>{String(needsAction)}</NativeTabs.Trigger.Badge>}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="billing">
        <NativeTabs.Trigger.Label>Billing</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'creditcard', selected: 'creditcard.fill' }}
          md="account_balance_wallet"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'person.crop.circle', selected: 'person.crop.circle.fill' }}
          md="person"
        />
      </NativeTabs.Trigger>

      {/* iOS 26 shows this apart from the other tabs, as the floating glass search button. */}
      <NativeTabs.Trigger name="search" role="search">
        <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="magnifyingglass" md="search" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
