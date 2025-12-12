"use client"

import { AlertCircle, Crown } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useAppStore } from "@/lib/store"
import { SUBSCRIPTION_PLANS } from "@/lib/constants"
import Link from "next/link"

interface SubscriptionLimitBannerProps {
  type: "exams" | "tests" | "subjects"
}

export function SubscriptionLimitBanner({ type }: SubscriptionLimitBannerProps) {
  const { user, getUsage } = useAppStore()
  const usage = getUsage()
  const plan = SUBSCRIPTION_PLANS[user?.subscription.planId || "FREE"]
  const limit = plan.limits[type]
  const current = usage[type]

  if (limit === Number.POSITIVE_INFINITY) return null

  const percentage = (current / limit) * 100
  const isNearLimit = percentage >= 80
  const isAtLimit = current >= limit

  if (!isNearLimit && !isAtLimit) return null

  return (
    <Alert variant={isAtLimit ? "destructive" : "default"} className="mb-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 mt-0.5" />
        <div className="flex-1 space-y-2">
          <AlertDescription>
            {isAtLimit ? (
              <div>
                <p className="font-semibold">{type.charAt(0).toUpperCase() + type.slice(1)} Limit Reached</p>
                <p className="text-sm mt-1">
                  You've used {current} of {limit} {type} on your {plan.name} plan. Upgrade to add more.
                </p>
              </div>
            ) : (
              <div>
                <p className="font-semibold">Approaching {type.charAt(0).toUpperCase() + type.slice(1)} Limit</p>
                <p className="text-sm mt-1">
                  You've used {current} of {limit} {type} ({Math.round(percentage)}%)
                </p>
              </div>
            )}
          </AlertDescription>
          <div className="flex items-center gap-3">
            <Progress value={percentage} className="flex-1" />
            <Link href="/settings?tab=subscription">
              <Button size="sm" variant={isAtLimit ? "default" : "outline"}>
                <Crown className="h-4 w-4 mr-2" />
                Upgrade Plan
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Alert>
  )
}
