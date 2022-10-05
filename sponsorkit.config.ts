import { defineConfig, presets } from 'sponsorkit'

export default defineConfig({
  tiers: [
    {
      title: '❤️ Backers',
      // to replace the entire tier rendering
      // compose: (composer, tierSponsors, config) => {
      //   composer.addRaw(
      //     '<-- custom svg -->',
      //   )
      // },
    },
    {
      title: '💖 Sponsors',
      monthlyDollars: 4,
      preset: {
        ...presets.medium,
        boxWidth: 90,
      },
      // to insert custom elements after the tier block
      composeAfter: (composer, tierSponsors, config) => {
        composer.addSpan(10)
      },
    },
    {
      title: '💓 Silver Sponsors',
      monthlyDollars: 16,
      preset: presets.large,
    },
    {
      title: '💗 Gold Sponsors',
      monthlyDollars: 64,
      preset: presets.xl,
    },
  ],
})
