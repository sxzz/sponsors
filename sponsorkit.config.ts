import { defineConfig, presets } from 'sponsorkit'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const RSS3_LOGO = (width: number, y: number) =>
  readFileSync(path.resolve(__dirname, './logo/crossbell.svg'), 'utf-8')
    .replace('${x}', String((width - 273) / 2))
    .replace('${y}', String(y))

export default defineConfig({
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

    {
      title: 'Special Sponsor',
      monthlyDollars: Infinity,
      composeAfter(compose, _, config) {
        if (
          config.filter?.({ monthlyDollars: Infinity } as any, []) !== false
        ) {
          compose
            .addSpan(20)
            .addText('Special Sponsor', 'sponsorkit-tier-title')
            .addSpan(10)
            .addRaw(RSS3_LOGO(config.width!, compose.height))
            .addSpan(100)
        }
      },
    },
  ],
})
