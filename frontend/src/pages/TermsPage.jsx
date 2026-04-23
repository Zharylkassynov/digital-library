import InfoPageLayout from '../components/InfoPageLayout'
import { useAppSettings } from '../context/AppSettingsContext'

export default function TermsPage() {
  const { t } = useAppSettings()

  return (
    <InfoPageLayout title={t('terms.title')}>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{t('terms.h1')}</h2>
        <p className="text-slate-700 dark:text-slate-300">{t('terms.p1')}</p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{t('terms.h2')}</h2>
        <p className="text-slate-700 dark:text-slate-300">{t('terms.p2')}</p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{t('terms.h3')}</h2>
        <p className="text-slate-700 dark:text-slate-300">{t('terms.p3')}</p>
      </section>
    </InfoPageLayout>
  )
}
