import { Component } from 'react';

export default class PageErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return <section className="section-band"><div className="section-shell" role="alert">
      <h1 className="text-2xl font-semibold">{this.props.t.ui.loadError}</h1>
      <button type="button" className="btn-primary mt-6" onClick={() => window.location.reload()}>{this.props.t.ui.reload}</button>
    </div></section>;
  }
}
