import { Component, type ReactNode, type ErrorInfo } from 'react'
import { Button } from '@/shared/ui'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Произошла ошибка</h2>
            <p className="text-sm text-gray-500 mb-4 max-w-md">
              {this.state.error?.message || 'Неожиданная ошибка приложения'}
            </p>
            <Button onClick={this.handleReset}>Попробовать снова</Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
