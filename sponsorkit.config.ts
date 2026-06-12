import { writeFile } from 'node:fs/promises'
import { defineConfig, tierPresets } from 'sponsorkit'

export default defineConfig({
  tiers: [
    {
      title: 'Past Sponsors',
      monthlyDollars: -1,
      preset: tierPresets.xs,
      composeBefore: (composer) => {
        composer.addSpan(32)
      },
    },
    {
      title: '❤️ Backers',
      preset: tierPresets.small,
    },
    {
      title: '💖 Sponsors',
      monthlyDollars: 8,
      preset: tierPresets.base,
    },
    {
      title: '💓 Bronze Sponsors',
      monthlyDollars: 32,
      preset: tierPresets.medium,
    },
    {
      title: '💗 Silver Sponsors',
      monthlyDollars: 64,
      preset: tierPresets.large,
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

  async onSponsorsReady(sponsors) {
    await writeFile(
      'sponsors.json',
      JSON.stringify(
        sponsors
          .filter((i) => i.privacyLevel !== 'PRIVATE')
          .map((i) => {
            return {
              name: i.sponsor.name,
              login: i.sponsor.login,
              avatar: i.sponsor.avatarUrl,
              amount: i.monthlyDollars,
              link: i.sponsor.linkUrl || i.sponsor.websiteUrl,
              org: i.sponsor.type === 'Organization',
            }
          })
          .sort((a, b) => b.amount - a.amount),
        null,
        2,
      ),
    )
  },

  outputDir: '.',
  formats: ['svg', 'png'],
  afdian: {
    exchangeRate: 7.2,
  },

  renders: [
    {
      name: 'sponsors',
      renderer: 'tiers',
      includePastSponsors: false,
    },
    {
      name: 'sponsors.wide',
      width: 1000,
      includePastSponsors: false,
    },
    {
      name: 'sponsors.circles',
      renderer: 'circles',
      includePastSponsors: true,
    },
    {
      name: 'sponsors.past',
      includePastSponsors: true,
    },
  ],
})
