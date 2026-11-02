import { Component, type ErrorInfo, type ReactNode } from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  /** Names the part of the app that failed, e.g. "The article". */
  area?: string;
}

interface State {
  error: Error | null;
}

/**
 * Catches errors thrown while rendering anything below it and shows a
 * recoverable message instead of a blank page. This has to be a class
 * component: React has no hook form of getDerivedStateFromError.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // A real app would send this to an error reporting service.
    console.error("Caught by ErrorBoundary:", error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <section
        role="alert"
        aria-labelledby="boundary-heading"
        className="mx-auto my-16 flex max-w-lg flex-col items-center gap-4 rounded-lg border border-alarm/25 bg-alarm-wash px-6 py-10 text-center"
      >
        <TriangleAlert className="size-8 text-alarm" aria-hidden="true" />
        <h2 id="boundary-heading" className="font-display text-2xl font-semibold">
          {this.props.area ?? "This page"} stopped working
        </h2>
        <p className="text-ink-soft">
          Something went wrong while drawing this part of the page. You can try again without
          reloading.
        </p>
        {import.meta.env.DEV && (
          <pre className="max-w-full overflow-x-auto rounded bg-surface p-3 text-left text-xs text-alarm">
            {error.message}
          </pre>
        )}
        <Button variant="outline" onClick={this.reset}>
          Try again
        </Button>
      </section>
    );
  }
}
