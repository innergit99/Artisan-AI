/// <reference types="vite/client" />
/// <reference types="vite/client" />
// Paddle Payment Integration for PublishLab SaaS
// Handles subscriptions, user tiers, and payment processing

export interface SubscriptionTier {
    id: string;
    name: string;
    price: number;
    yearlyPrice?: number;
    features: string[];
    paddleProductId?: string; // Monthly ID
    paddleYearlyProductId?: string; // Yearly ID
    limits: {
        booksPerMonth: number;
        imagesPerMonth: number;
        chaptersPerBook: number;
        priority: 'low' | 'normal' | 'high';
    };
}

// Define subscription tiers
export const SUBSCRIPTION_TIERS: Record<string, SubscriptionTier> = {
    FREE: {
        id: 'free',
        name: 'Novice',
        price: 0,
        features: [
            '1 Manuscript / Mo',
            'Full Canvas Mockup Suite',
            'Standard AI Model (Pollinations)',
            'Community Support',
        ],
        limits: {
            booksPerMonth: 1,
            imagesPerMonth: 5,
            chaptersPerBook: 10,
            priority: 'low',
        },
    },

    SOLO: {
        id: 'solo',
        name: 'Solo Builder',
        price: 12.99,
        yearlyPrice: 124.99,
        paddleProductId: 'pri_01kh3z7fx618mjrjagj2b9cxqa',
        paddleYearlyProductId: 'pri_01kh3z49dtwybn7e3mf5rp609j',
        features: [
            '5 Manuscripts / Mo',
            '300 DPI High-Res Assets',
            'Standard Character Bibles',
            'Priority Support',
            'No Watermarks',
        ],
        limits: {
            booksPerMonth: 5,
            imagesPerMonth: 50,
            chaptersPerBook: 20,
            priority: 'normal',
        },
    },

    ARTISAN: {
        id: 'artisan',
        name: 'Artisan',
        price: 14.99,
        yearlyPrice: 143.99,
        paddleProductId: 'pri_01kh3yyxwayxxqa46hdmyy451v',
        paddleYearlyProductId: 'pri_01kh3yvkeq3e58mqapxwxmy2sv',
        features: [
            'Unlimited Manuscripts',
            '300 DPI High-Res Assets',
            'Trend Radar API Access',
            'Gemini 1.5 Pro Engine',
            'Advanced Character Bibles',
            'Priority Support',
        ],
        limits: {
            booksPerMonth: 999,
            imagesPerMonth: 999,
            chaptersPerBook: 50,
            priority: 'high',
        },
    },

    MASTER: {
        id: 'master',
        name: 'Artisan Master',
        price: 49.00,
        yearlyPrice: 470.00,
        paddleProductId: 'pri_01kh3yrj9trbxwnaqmgbf3hrvp',
        paddleYearlyProductId: 'pri_01kh3yn5e6tg9xwfyx3m2svrwf',
        features: [
            'Everything in Artisan',
            'Multi-Agent Collaboration',
            '1-Click Export Validation',
            'Whitelabel Export',
            'Dedicated Account Manager',
            'Custom AI Fine-tuning',
        ],
        limits: {
            booksPerMonth: 9999,
            imagesPerMonth: 9999,
            chaptersPerBook: 100,
            priority: 'high',
        },
    },
};

// User subscription state
export interface UserSubscription {
    tier: keyof typeof SUBSCRIPTION_TIERS;
    paddleSubscriptionId?: string;
    subscriptionStatus: 'active' | 'cancelled' | 'past_due' | 'trial';
    currentPeriodEnd?: Date;
    usage: {
        booksThisMonth: number;
        imagesThisMonth: number;
    };
}

// Initialize Paddle
export async function initializePaddle(): Promise<void> {
    const paddleToken = import.meta.env.VITE_PADDLE_CLIENT_TOKEN;
    const sellerId = import.meta.env.VITE_PADDLE_VENDOR_ID || '281327'; // User's ID from screenshot

    if (!paddleToken) {
        console.warn('⚠️ Paddle initialization token missing (VITE_PADDLE_CLIENT_TOKEN)');
        return;
    }

    // Load Paddle.js (v2)
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;

    script.onload = () => {
        // @ts-ignore
        if (window.Paddle) {
            const paddleEnv = import.meta.env.VITE_PADDLE_ENVIRONMENT || 'sandbox';
            // @ts-ignore
            window.Paddle.Environment.set(paddleEnv);
            // @ts-ignore
            window.Paddle.Initialize({
                token: paddleToken,
                seller: parseInt(sellerId),
                eventCallback: handlePaddleEvent,
            });
            console.log(`✅ Paddle v2 initialized in ${paddleEnv} mode (Seller: ${sellerId})`);
        }
    };

    document.head.appendChild(script);
}

// Handle Paddle events
function handlePaddleEvent(event: any) {
    console.log('Paddle event:', event);

    switch (event.name) {
        case 'checkout.completed':
            handleCheckoutCompleted(event.data);
            break;
        case 'checkout.closed':
            handleCheckoutClosed(event.data);
            break;
    }
}

// Open Paddle checkout
export async function openPaddleCheckout(tier: SubscriptionTier, userEmail?: string, billingCycle: 'monthly' | 'yearly' = 'monthly'): Promise<void> {
    // @ts-ignore
    if (!window.Paddle) {
        alert('Payment system not loaded. Please refresh and try again.');
        return;
    }

    const priceId = billingCycle === 'yearly' ? tier.paddleYearlyProductId : tier.paddleProductId;

    if (!priceId) {
        alert('This plan is not yet configured for the selected billing cycle. Please contact support.');
        return;
    }

    // @ts-ignore
    window.Paddle.Checkout.open({
        items: [
            {
                priceId: priceId,
                quantity: 1,
            },
        ],
        customer: userEmail ? { email: userEmail } : undefined,
        customData: {
            tierId: tier.id,
            billingCycle: billingCycle,
            source: 'publishlab-ink',
        },
    });
}

// Handle successful checkout
function handleCheckoutCompleted(data: any) {
    console.log('✅ Checkout completed:', data);

    // Save subscription data to localStorage (in production, use backend)
    const subscription: UserSubscription = {
        tier: data.customData.tierId,
        paddleSubscriptionId: data.subscription_id,
        subscriptionStatus: 'active',
        currentPeriodEnd: new Date(data.next_payment_date),
        usage: {
            booksThisMonth: 0,
            imagesThisMonth: 0,
        },
    };

    localStorage.setItem('userSubscription', JSON.stringify(subscription));

    // Reload to apply new tier
    window.location.reload();
}

// Handle checkout closed
function handleCheckoutClosed(data: any) {
    console.log('Checkout closed:', data);
}

// Get current user tier
export function getCurrentTier(): SubscriptionTier {
    const subscriptionStr = localStorage.getItem('userSubscription');

    if (!subscriptionStr) {
        return SUBSCRIPTION_TIERS.FREE;
    }

    try {
        const subscription: UserSubscription = JSON.parse(subscriptionStr);
        return SUBSCRIPTION_TIERS[subscription.tier] || SUBSCRIPTION_TIERS.FREE;
    } catch (e) {
        return SUBSCRIPTION_TIERS.FREE;
    }
}

// Check if user can perform action
export function canPerformAction(action: 'book' | 'image' | 'chapter'): boolean {
    const tier = getCurrentTier();
    const subscriptionStr = localStorage.getItem('userSubscription');

    if (!subscriptionStr) {
        // Free tier user
        const usage = getUsage();

        if (action === 'book') {
            return usage.booksThisMonth < tier.limits.booksPerMonth;
        } else if (action === 'image') {
            return usage.imagesThisMonth < tier.limits.imagesPerMonth;
        }
    }

    // Paid tier - check limits
    try {
        const subscription: UserSubscription = JSON.parse(subscriptionStr);

        if (action === 'book') {
            return subscription.usage.booksThisMonth < tier.limits.booksPerMonth;
        } else if (action === 'image') {
            return subscription.usage.imagesThisMonth < tier.limits.imagesPerMonth;
        }
    } catch (e) {
        return false;
    }

    return true;
}

// Track usage
export function trackUsage(action: 'book' | 'image') {
    const subscriptionStr = localStorage.getItem('userSubscription');

    if (!subscriptionStr) {
        // Track free tier usage
        const usage = getUsage();

        if (action === 'book') {
            usage.booksThisMonth++;
        } else if (action === 'image') {
            usage.imagesThisMonth++;
        }

        localStorage.setItem('usage', JSON.stringify(usage));
        return;
    }

    try {
        const subscription: UserSubscription = JSON.parse(subscriptionStr);

        if (action === 'book') {
            subscription.usage.booksThisMonth++;
        } else if (action === 'image') {
            subscription.usage.imagesThisMonth++;
        }

        localStorage.setItem('userSubscription', JSON.stringify(subscription));
    } catch (e) {
        console.error('Failed to track usage:', e);
    }
}

// Get usage for free tier
function getUsage(): { booksThisMonth: number; imagesThisMonth: number } {
    const usageStr = localStorage.getItem('usage');

    if (!usageStr) {
        return { booksThisMonth: 0, imagesThisMonth: 0 };
    }

    try {
        return JSON.parse(usageStr);
    } catch (e) {
        return { booksThisMonth: 0, imagesThisMonth: 0 };
    }
}

// Reset usage (call this monthly)
export function resetUsage() {
    const subscriptionStr = localStorage.getItem('userSubscription');

    if (subscriptionStr) {
        const subscription: UserSubscription = JSON.parse(subscriptionStr);
        subscription.usage = { booksThisMonth: 0, imagesThisMonth: 0 };
        localStorage.setItem('userSubscription', JSON.stringify(subscription));
    }

    localStorage.setItem('usage', JSON.stringify({ booksThisMonth: 0, imagesThisMonth: 0 }));
}

// Cancel subscription
export async function cancelSubscription() {
    // In production, call Paddle API to cancel
    // For now, just update local state
    const subscriptionStr = localStorage.getItem('userSubscription');

    if (subscriptionStr) {
        const subscription: UserSubscription = JSON.parse(subscriptionStr);
        subscription.subscriptionStatus = 'cancelled';
        localStorage.setItem('userSubscription', JSON.stringify(subscription));
    }

    alert('Subscription cancelled. You can continue using until the end of the billing period.');
}
