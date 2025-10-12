import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false })
  }

  handleGoHome = () => {
    this.handleReset()
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-md w-full  shadow-lg rounded-lg p-8 text-center">
            <div className="mb-6">
              <p className="text-3xl font-medium text-white mb-2">Algo salió mal</p>
              <p className="text-gray">
                Por favor, intenta nuevamente
              </p>
            </div>
            <button
              onClick={this.handleGoHome}
              className="w-full py-2 px-4 rounded-sm"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary