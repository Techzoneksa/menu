export default function MenuLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--light-background)' }}>
      <div className="w-10 h-10 border-3 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--brand-primary)', borderTopColor: 'transparent' }} />
    </div>
  );
}
