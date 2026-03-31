import PageHeader from './PageHeader'

interface Props {
  title: string
  subtitle?: string
  children: React.ReactNode
  headerContent?: React.ReactNode
}

export default function PageShell({ title, subtitle, children, headerContent }: Props) {
  return (
    <div className="flex flex-1 flex-col" style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}>
      {/* Hero gradient header — consistent across all pages */}
      <div className="noise-bg relative bg-gradient-to-b from-accent/10 via-surface to-surface px-4 pb-6 pt-6">
        <div className="relative z-10">
          <PageHeader />
          <h1 className="defqon-heading text-2xl sm:text-3xl text-text-primary">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>}
          {headerContent}
        </div>
      </div>

      {/* Page content */}
      <div className="px-4 pt-4">
        {children}
      </div>
    </div>
  )
}
