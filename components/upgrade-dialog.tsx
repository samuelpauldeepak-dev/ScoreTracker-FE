"use client"

import { Crown, Check } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SUBSCRIPTION_PLANS } from "@/lib/constants"
import { useAppStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

interface UpgradeDialogProps {
  open: boolean
  onClose: () => void
  reason?: string
}

export function UpgradeDialog({ open, onClose, reason }: UpgradeDialogProps) {
  const { user } = useAppStore()
  const { toast } = useToast()
  const currentPlan = user?.subscription.planId || "FREE"

  const plans = [SUBSCRIPTION_PLANS.FREE, SUBSCRIPTION_PLANS.BASIC, SUBSCRIPTION_PLANS.PRO, SUBSCRIPTION_PLANS.PRO_PLUS]

  const handleUpgrade = (planId: string) => {
    toast({
      title: "Upgrade Initiated",
      description: `This is a demo. In production, you would be redirected to payment for the ${planId} plan.`,
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl min-w-[80vw] max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Crown className="h-6 w-6 text-primary" />
            Upgrade Your Venyto Plan
          </DialogTitle>
          {reason && <DialogDescription className="text-base">{reason}</DialogDescription>}
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-8">
          {plans.map((plan) => {
            const isCurrent = currentPlan === plan.id.toUpperCase()
            return (
              <Card
                key={plan.id}
                className={`p-6 flex flex-col min-h-[400px] ${isCurrent ? "border-primary border-2 shadow-lg" : ""}`}
              >
                {isCurrent && (
                  <Badge className="w-fit mb-3" variant="default">
                    Current Plan
                  </Badge>
                )}
                <div className="mb-6">
                  <h3 className="font-bold text-xl mb-2">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">
                      {plan.currency}
                      {plan.price}
                    </span>
                    {plan.price > 0 && <span className="text-muted-foreground">/month</span>}
                  </div>
                </div>

                <ul className="space-y-3 mb-6 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isCurrent}
                  variant={isCurrent ? "outline" : "default"}
                  className="w-full"
                >
                  {isCurrent ? "Current Plan" : `Upgrade to ${plan.name}`}
                </Button>
              </Card>
            )
          })}
        </div>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            All plans include a 7-day money-back guarantee. Cancel anytime.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
