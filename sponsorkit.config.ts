import { defineConfig, tierPresets } from 'sponsorkit'

export default defineConfig({
  formats: ['svg', 'json'],
  includePastSponsors: false,
  afdian: {
    exechangeRate: 6.8,
  },
  tiers: [
    {
      title: 'Past Sponsors',
      monthlyDollars: -1,
      preset: tierPresets.xs,
    },
    {
      title: '❤️ Backers',
      preset: tierPresets.base,
    },
    {
      title: '💖 Sponsors',
      monthlyDollars: 8,
      preset: tierPresets.medium,
      composeAfter: (composer, tierSponsors, config) => {
        composer.addSpan(10)
      },
    },
    {
      title: '💓 Bronze Sponsors',
      monthlyDollars: 32,
      preset: tierPresets.large,
    },
    {
      title: '💗 Silver Sponsors',
      monthlyDollars: 64,
      preset: tierPresets.xl,
    },
    {
      title: '💞 Gold Sponsors',
      monthlyDollars: 256,
      preset: tierPresets.xl,
    },
    {
      title: '💝 Platinum Sponsors',
      monthlyDollars: 512,
      preset: tierPresets.xl,
    },
    {
      title: '💘 Diamond Sponsors',
      monthlyDollars: 1024,
      preset: tierPresets.xl,
    },
  ],
  renders: [
    {
      name: 'sponsors',
      renderer: 'tiers',
    },
    {
      name: 'sponsors.wide',
      width: 1000,
    },
    {
      name: 'sponsors.circles',
      renderer: 'circles',
    },
  ],
})
