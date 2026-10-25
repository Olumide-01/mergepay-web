import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { WalletWarningDialog } from "./WalletWarningDialog";

describe("WalletWarningDialog (#716)", () => {
  it("does not render when open is false", () => {
    render(
      <WalletWarningDialog
        open={false}
        onClose={vi.fn()}
        onRetry={vi.fn()}
      />
    );
    expect(screen.queryByTestId("wallet-warning-dialog")).not.toBeInTheDocument();
  });

  it("renders distinct warning dialog when Freighter is locked", () => {
    const handleRetry = vi.fn();
    render(
      <WalletWarningDialog
        open={true}
        errorCode="locked"
        onClose={vi.fn()}
        onRetry={handleRetry}
      />
    );

    expect(screen.getByTestId("wallet-warning-dialog")).toBeInTheDocument();
    expect(screen.getByTestId("wallet-warning-title")).toHaveTextContent(/Freighter Wallet Locked/i);
    expect(screen.getByTestId("wallet-warning-message")).toHaveTextContent(
      /Your Freighter wallet is currently locked/i
    );

    const retryBtn = screen.getByTestId("retry-connection-button");
    expect(retryBtn).toBeInTheDocument();
    expect(retryBtn).toHaveTextContent(/Retry Connection/i);

    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it("renders distinct warning dialog with install link when Freighter is unavailable or not installed", () => {
    const handleRetry = vi.fn();
    render(
      <WalletWarningDialog
        open={true}
        errorCode="not_installed"
        onClose={vi.fn()}
        onRetry={handleRetry}
      />
    );

    expect(screen.getByTestId("wallet-warning-dialog")).toBeInTheDocument();
    expect(screen.getByTestId("wallet-warning-title")).toHaveTextContent(/Freighter Not Detected/i);
    expect(screen.getByTestId("wallet-warning-message")).toHaveTextContent(
      /Freighter browser extension was not detected/i
    );

    const installLink = screen.getByTestId("install-freighter-button");
    expect(installLink).toBeInTheDocument();
    expect(installLink).toHaveAttribute("href", "https://freighter.app");
    expect(installLink).toHaveAttribute("target", "_blank");

    const retryBtn = screen.getByTestId("retry-connection-button");
    expect(retryBtn).toBeInTheDocument();
    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it("renders timeout warning dialog for extension timeouts", () => {
    render(
      <WalletWarningDialog
        open={true}
        errorCode="timeout"
        onClose={vi.fn()}
        onRetry={vi.fn()}
      />
    );

    expect(screen.getByTestId("wallet-warning-title")).toHaveTextContent(/Connection Timed Out/i);
    expect(screen.getByTestId("wallet-warning-message")).toHaveTextContent(
      /The Freighter connection request timed out/i
    );
  });

  it("renders loading state on Retry Connection button when isRetrying is true", () => {
    render(
      <WalletWarningDialog
        open={true}
        errorCode="locked"
        isRetrying={true}
        onClose={vi.fn()}
        onRetry={vi.fn()}
      />
    );

    const retryBtn = screen.getByTestId("retry-connection-button");
    expect(retryBtn).toBeDisabled();
    expect(screen.getByTestId("wallet-warning-dismiss")).toBeDisabled();
  });

  it("invokes onClose when Dismiss button is clicked", () => {
    const handleClose = vi.fn();
    render(
      <WalletWarningDialog
        open={true}
        errorCode="locked"
        onClose={handleClose}
        onRetry={vi.fn()}
      />
    );

    const dismissBtn = screen.getByTestId("wallet-warning-dismiss");
    fireEvent.click(dismissBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
