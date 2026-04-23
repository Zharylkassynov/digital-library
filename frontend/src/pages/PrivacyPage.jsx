import InfoPageLayout from '../components/InfoPageLayout'
import { useAppSettings } from '../context/AppSettingsContext'

export default function PrivacyPage() {
  const { t, locale } = useAppSettings()
  const dateStr = new Date().toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US')

  return (
    <InfoPageLayout title={t('privacy.title')}>
      <p className="text-slate-700 dark:text-slate-300">
        {t('privacy.updated')} {dateStr}
      </p>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{t('privacy.h1')}</h2>
        <p className="text-slate-700 dark:text-slate-300">{t('privacy.p1')}</p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{t('privacy.h2')}</h2>
        <p className="text-slate-700 dark:text-slate-300">{t('privacy.p2')}</p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{t('privacy.h3')}</h2>
        <p className="text-slate-700 dark:text-slate-300">{t('privacy.p3')}</p>
      </section>
    </InfoPageLayout>
  )
}
