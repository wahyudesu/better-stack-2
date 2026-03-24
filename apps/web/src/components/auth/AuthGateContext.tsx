"use client";

import {
	createContext,
	useContext,
	useState,
	useCallback,
	type ReactNode,
	useEffect,
} from "react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

interface AuthGateContextValue {
  /**
   * Request authentication. Returns true if user is already authenticated,
   * otherwise shows Clerk's sign in modal and returns false.
   */
  requireAuth: (options?: AuthGateOptions) => boolean;
  /**
   * Wraps a callback to only execute if user is authenticated.
   * Shows Clerk's sign in modal if not authenticated.
   */
  gatedCallback: <T extends (...args: any[]) => any>(
    callback: T,
    options?: AuthGateOptions
  ) => T;
  isSignedIn: boolean;
  showSignIn: () => void;
  showSignUp: () => void;
}

interface AuthGateOptions {
  title?: string;
  description?: string;
}

const AuthGateContext = createContext<AuthGateContextValue | null>(null);

export function useAuthGate() {
  const context = useContext(AuthGateContext);
  if (!context) {
    throw new Error("useAuthGate must be used within AuthGateProvider");
  }
  return context;
}

interface AuthGateProviderProps {
  children: ReactNode;
  isSignedIn: boolean;
}

// State to trigger Clerk's modal
let signInTrigger: (() => void) | null = null;
let signUpTrigger: (() => void) | null = null;

export function setSignInTrigger(fn: () => void) {
  signInTrigger = fn;
}

export function setSignUpTrigger(fn: () => void) {
  signUpTrigger = fn;
}

export function AuthGateProvider({ children, isSignedIn }: AuthGateProviderProps) {
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    mode: "sign_in" | "sign_up";
  }>({
    open: false,
    mode: "sign_in",
  });

  const showSignIn = useCallback(() => {
    setDialogState({ open: true, mode: "sign_in" });
  }, []);

  const showSignUp = useCallback(() => {
    setDialogState({ open: true, mode: "sign_up" });
  }, []);

  const requireAuth = useCallback((options?: AuthGateOptions) => {
    if (isSignedIn) return true;

    // Show Clerk's sign in modal
    setDialogState({ open: true, mode: "sign_in" });
    return false;
  }, [isSignedIn]);

  const gatedCallback = useCallback(
    <T extends (...args: any[]) => any>(
      callback: T,
      options?: AuthGateOptions
    ): T => {
      return ((...args: Parameters<T>) => {
        if (isSignedIn) {
          return callback(...args);
        }
        // Show Clerk's sign in modal
        setDialogState({ open: true, mode: "sign_in" });
      }) as T;
    },
    [isSignedIn]
  );

  // Register triggers for external access
  useEffect(() => {
    setSignInTrigger(showSignIn);
    setSignUpTrigger(showSignUp);
    return () => {
      setSignInTrigger(() => {});
      setSignUpTrigger(() => {});
    };
  }, [showSignIn, showSignUp]);

  return (
    <AuthGateContext.Provider value={{ requireAuth, gatedCallback, isSignedIn, showSignIn, showSignUp }}>
      {children}

      {/* Clerk's Built-in Modal - Controlled by state */}
      {dialogState.mode === "sign_in" ? (
        <SignInButton
          mode="modal"
          forceRedirectUrl="/"
        >
          <button
            ref={(el) => {
              if (el && dialogState.open && dialogState.mode === "sign_in") {
                el.click();
                setDialogState((prev) => ({ ...prev, open: false }));
              }
            }}
            style={{ display: "none" }}
          />
        </SignInButton>
      ) : (
        <SignUpButton
          mode="modal"
          forceRedirectUrl="/"
        >
          <button
            ref={(el) => {
              if (el && dialogState.open && dialogState.mode === "sign_up") {
                el.click();
                setDialogState((prev) => ({ ...prev, open: false }));
              }
            }}
            style={{ display: "none" }}
          />
        </SignUpButton>
      )}
    </AuthGateContext.Provider>
  );
}
