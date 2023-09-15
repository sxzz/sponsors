import { defineConfig, presets } from 'sponsorkit'

export default defineConfig({
  formats: ['svg', 'json'],
  tiers: [
    {
      title: 'Past Sponsors',
      monthlyDollars: -1,
      preset: presets.xs,
    },
    {
      title: '❤️ Backers',
      preset: presets.base,
    },
    {
      title: '💖 Sponsors',
      monthlyDollars: 8,
      preset: presets.medium,
      composeAfter: (composer, tierSponsors, config) => {
        composer.addSpan(10)
      },
    },
    {
      title: '💓 Bronze Sponsors',
      monthlyDollars: 32,
      preset: presets.large,
    },
    {
      title: '💗 Silver Sponsors',
      monthlyDollars: 64,
      preset: presets.xl,
    },
    {
      title: '💞 Gold Sponsors',
      monthlyDollars: 256,
      preset: presets.xl,
    },
  ],
})
