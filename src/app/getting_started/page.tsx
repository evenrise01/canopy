"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Checkbox } from "~/components/ui/checkbox";

const STEPS = [
  "Business Category",
  "Business Details",
  "Intended Usage",
  "Subscription",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessCategory: "",
    currency: "USD",
    businessType: "",
    teamSize: "",
    intendedUsage: [] as string[],
  });

  const createWorkspace = api.workspace.create.useMutation();
  const updateOnboarding = api.workspace.updateOnboarding.useMutation();

  const handleNext = async () => {
    if (step === 1) {
      await createWorkspace.mutateAsync({
        businessCategory: formData.businessCategory,
      });
      setStep(2);
    } else if (step === 2) {
      await updateOnboarding.mutateAsync({
        currency: formData.currency,
        businessType: formData.businessType,
        teamSize: formData.teamSize,
      });
      setStep(3);
    } else if (step === 3) {
      await updateOnboarding.mutateAsync({
        intendedUsage: formData.intendedUsage,
      });
      setStep(4);
    } else if (step === 4) {
      await updateOnboarding.mutateAsync({
        onboardingComplete: true,
      });
      router.push("/dashboard");
    }
  };

  const progress = (step / STEPS.length) * 100;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-500">Step {step} of {STEPS.length}</span>
            <span className="text-sm font-medium text-slate-500">{STEPS[step - 1]}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent className="pt-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">What kind of work does your business do?</Label>
                <Input
                  id="category"
                  placeholder="e.g. Design, Development, Marketing"
                  value={formData.businessCategory}
                  onChange={(e) => setFormData({ ...formData, businessCategory: e.target.value })}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Which currency do you bill your clients in?</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(v) => setFormData({ ...formData, currency: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>What type of business do you have?</Label>
                <RadioGroup
                  value={formData.businessType}
                  onValueChange={(v) => setFormData({ ...formData, businessType: v })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Solo" id="solo" />
                    <Label htmlFor="solo">Solo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Agency" id="agency" />
                    <Label htmlFor="agency">Agency</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Studio" id="studio" />
                    <Label htmlFor="studio">Studio</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Company" id="company" />
                    <Label htmlFor="company">Company</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>How many people work in your business?</Label>
                <Select
                  value={formData.teamSize}
                  onValueChange={(v) => setFormData({ ...formData, teamSize: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Just me">Just me</SelectItem>
                    <SelectItem value="2-5">2-5</SelectItem>
                    <SelectItem value="6-20">6-20</SelectItem>
                    <SelectItem value="21-100">21-100</SelectItem>
                    <SelectItem value="100+">100+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <Label>How do you plan to use Canopy?</Label>
              <div className="space-y-3">
                {[
                  "Manage clients & projects",
                  "Send proposals & agreements",
                  "Bill clients with invoices",
                  "Manage milestones & deliverables",
                  "Plan team resources",
                ].map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={formData.intendedUsage.includes(option)}
                      onCheckedChange={(checked) => {
                        const newUsage = checked
                          ? [...formData.intendedUsage, option]
                          : formData.intendedUsage.filter((i) => i !== option);
                        setFormData({ ...formData, intendedUsage: newUsage });
                      }}
                    />
                    <Label htmlFor={option} className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 text-center py-6">
              <h3 className="text-xl font-semibold">Start your 7-day free trial</h3>
              <p className="text-slate-500 text-sm">
                Get full access to Canopy features for 7 days. You won&apos;t be charged until your trial ends.
              </p>
              <div className="bg-slate-100 p-4 rounded-lg text-left text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Trial duration:</span>
                  <span className="font-medium">7 days</span>
                </div>
                <div className="flex justify-between">
                  <span>Billing start date:</span>
                  <span className="font-medium">Jan 23, 2026</span>
                </div>
                <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-medium">$29/month</span>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                Cancel anytime before Jan 23 to avoid charges.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          <Button 
            className="ml-auto" 
            onClick={handleNext}
            disabled={
                (step === 1 && !formData.businessCategory) ||
                (step === 2 && (!formData.currency || !formData.businessType || !formData.teamSize)) ||
                createWorkspace.isPending || 
                updateOnboarding.isPending
            }
          >
            {step === STEPS.length ? "Complete Setup" : "Next Step"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
