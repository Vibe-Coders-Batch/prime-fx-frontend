"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Loader2, XCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { LearningSurface, Panel } from "@/components/learning/learning-surface";
import { useVerifyPayment } from "@/features/payments/hooks/use-payments";

const REDIRECT_SECONDS = 5;

function prefersReducedMotion() {
    return (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
}

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get("sessionId");
    const { mutate: verifyPayment, isPending, isSuccess, isError, error } = useVerifyPayment();
    const [countdown, setCountdown] = useState(REDIRECT_SECONDS);
    const [shouldRedirect, setShouldRedirect] = useState(false);

    useEffect(() => {
        if (sessionId) {
            verifyPayment({ sessionId });
        }
    }, [sessionId, verifyPayment]);

    useEffect(() => {
        if (shouldRedirect) {
            router.push("/learner/my-courses");
        }
    }, [shouldRedirect, router]);

    useEffect(() => {
        if (!isSuccess) return;

        // One celebratory burst, skipped entirely for reduced-motion users.
        let confettiInterval: ReturnType<typeof setInterval> | null = null;
        if (!prefersReducedMotion()) {
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
            confettiInterval = setInterval(() => {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) {
                    if (confettiInterval) clearInterval(confettiInterval);
                    return;
                }
                const particleCount = 50 * (timeLeft / duration);
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                });
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                });
            }, 250);
        }

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setShouldRedirect(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(timer);
            if (confettiInterval) clearInterval(confettiInterval);
        };
    }, [isSuccess]);

    if (!sessionId) {
        return (
            <LearningSurface>
                <Panel className="mx-auto max-w-lg p-8 text-center">
                    <XCircle
                        aria-hidden="true"
                        className="mx-auto mb-5 h-12 w-12 text-[var(--ls-risk)]"
                    />
                    <h1 className="text-xl font-semibold text-[var(--ls-ink)]">Invalid session</h1>
                    <p className="mt-2 text-sm text-[var(--ls-ink-quiet)]">
                        No payment session ID found. Please verify your payment source.
                    </p>
                    <Button
                        onClick={() => router.push("/learner/dashboard")}
                        size="lg"
                        className="mt-6 w-full"
                    >
                        Go to Dashboard
                    </Button>
                </Panel>
            </LearningSurface>
        );
    }

    return (
        <LearningSurface>
            <Panel className="mx-auto max-w-lg p-8 text-center">
                {isPending ? (
                    <div aria-live="polite">
                        <Loader2
                            aria-hidden="true"
                            className="mx-auto mb-5 h-10 w-10 animate-spin text-[var(--ls-accent)]"
                        />
                        <h1 className="text-xl font-semibold text-[var(--ls-ink)]">
                            Verifying payment
                        </h1>
                        <p className="mt-2 text-sm text-[var(--ls-ink-quiet)]">
                            Securing your enrollment...
                        </p>
                    </div>
                ) : null}

                {isSuccess ? (
                    <div aria-live="polite">
                        <Image
                            src="/illustrations/stripe_payments.svg"
                            width={200}
                            height={160}
                            alt=""
                            className="mx-auto mb-6"
                        />
                        <h1 className="text-2xl font-semibold text-[var(--ls-ink)]">
                            Payment successful
                        </h1>
                        <p className="mt-2 text-sm text-[var(--ls-ink-quiet)]">
                            You&apos;re all set. Your enrolment is confirmed.
                        </p>

                        <div className="mt-6 rounded-md border border-[var(--ls-divider)] bg-[var(--ls-paper-quiet)] p-4">
                            <p className="text-sm text-[var(--ls-ink)]">
                                Redirecting to your courses
                            </p>
                            <div
                                role="progressbar"
                                aria-label="Time until redirect"
                                aria-valuenow={countdown}
                                aria-valuemin={0}
                                aria-valuemax={REDIRECT_SECONDS}
                                className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--ls-neutral-tint)]"
                            >
                                <div
                                    className="h-full rounded-full bg-[var(--ls-accent)] transition-[width] duration-1000 ease-linear"
                                    style={{
                                        width: `${(countdown / REDIRECT_SECONDS) * 100}%`,
                                    }}
                                />
                            </div>
                            <p className="ls-nums mt-2 text-xs text-[var(--ls-ink-quiet)]">
                                {countdown} seconds remaining
                            </p>
                        </div>

                        <Button
                            onClick={() => router.push("/learner/my-courses")}
                            size="lg"
                            className="mt-5 w-full"
                        >
                            Go Now
                        </Button>
                    </div>
                ) : null}

                {isError ? (
                    <div aria-live="polite">
                        <XCircle
                            aria-hidden="true"
                            className="mx-auto mb-5 h-12 w-12 text-[var(--ls-risk)]"
                        />
                        <h1 className="text-xl font-semibold text-[var(--ls-ink)]">
                            Verification failed
                        </h1>
                        <p className="mt-2 text-sm text-[var(--ls-ink-quiet)]">
                            We could not verify your payment right now.
                        </p>
                        {error ? (
                            <div className="mt-4 rounded-md border border-[var(--ls-divider)] bg-[var(--ls-risk-tint)] p-4 text-left text-sm text-[var(--ls-risk)]">
                                <span className="mb-1 block font-semibold">Error details</span>
                                {String((error as any)?.message || "An unknown error occurred")}
                            </div>
                        ) : null}
                        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                            <Button
                                onClick={() => verifyPayment({ sessionId })}
                                size="lg"
                                className="w-full"
                            >
                                Retry Verification
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => router.push("/contact")}
                                size="lg"
                                className="w-full"
                            >
                                Contact Support
                            </Button>
                        </div>
                    </div>
                ) : null}
            </Panel>
        </LearningSurface>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense
            fallback={
                <LearningSurface>
                    <Panel className="mx-auto max-w-lg p-8 text-center">
                        <Loader2
                            aria-hidden="true"
                            className="mx-auto h-10 w-10 animate-spin text-[var(--ls-accent)]"
                        />
                    </Panel>
                </LearningSurface>
            }
        >
            <PaymentSuccessContent />
        </Suspense>
    );
}
