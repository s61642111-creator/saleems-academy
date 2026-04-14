import React from 'react';
export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  state = { hasError: false, error: undefined };
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
  }
  render() {
    if (this.state.hasError) return (
      <div className="flex items-center justify-center min-h-screen p-8 text-center">
        <div className="space-y-4">
          <p className="text-5xl">⚠️</p>
          <h1 className="text-xl font-bold">Something went wrong</h1>
          <p className="text-muted-foreground text-sm max-w-sm">{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
        </div>
      </div>
    );
    return this.props.children;
  }
}