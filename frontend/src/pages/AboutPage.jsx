import InfoPageLayout from '../components/InfoPageLayout'
import { useAppSettings } from '../context/AppSettingsContext'

export default function AboutPage() {
  const { t } = useAppSettings()

  return (
    <InfoPageLayout title={t('about.title')}>
      <p className="text-lg text-slate-700 dark:text-slate-300">
        {t('about.intro', { brand: t('brand') })}
      </p>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{t('about.missionTitle')}</h2>
        <p className="text-slate-700 dark:text-slate-300">{t('about.missionBody')}</p>
      </section>
      <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/5">
          <h3 className="mb-1 font-medium text-[#0891b2] dark:text-[#22d3ee]">{t('about.curatedTitle')}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">{t('about.curatedBody')}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/5 dark:bg-white/5">
          <h3 className="mb-1 font-medium text-[#7c3aed] dark:text-[#8b5cf6]">{t('about.stackTitle')}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">{t('about.stackBody')}</p>
        </div>
      </div>
    </InfoPageLayout>
  )
}
