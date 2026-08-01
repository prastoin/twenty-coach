import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

// Links to the stable /s/pwa route (open-pwa logic function) rather than
// the public-asset URL, whose embedded ids change on reinstall.
//
// The origin must be absolute: LINK items render scheme-less values as
// `https://<link>` (yielding a broken empty-host URL for relative paths),
// and post-install stamping doesn't survive re-applies. Instance-specific
// for now — revisit if Twenty gains relative link support (noted in #31).
const INSTANCE_URL = 'http://localhost:2020';

export default defineNavigationMenuItem({
  universalIdentifier: '78d1a707-4a3c-448e-9953-a4789aa12704',
  position: 4,
  type: NavigationMenuItemType.LINK,
  name: 'Trainee app',
  icon: 'IconDeviceMobile',
  link: `${INSTANCE_URL}/s/pwa`,
});
